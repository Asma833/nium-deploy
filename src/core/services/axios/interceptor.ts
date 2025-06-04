import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { store } from '@/store';
import { logout, updateAccessToken } from '@/features/auth/store/authSlice';
import { API } from '@/core/constant/apis';
import {
  encryptRequestInterceptor,
  decryptResponseInterceptor,
} from '@/core/services/encryption/encryptionInterceptor';

interface RefreshTokenResponse {
  data: {
    accessToken: string;
  };
  message: string;
}

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((request) => {
    if (token) {
      request.resolve(token);
    } else {
      request.reject(error);
    }
  });
  failedQueue = [];
};

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  // Request interceptors (order matters - encryption first, then auth)
  axiosInstance.interceptors.request.use(
    async (config) => {
      // Apply encryption first
      const encryptedConfig = await encryptRequestInterceptor(config);

      // Then apply authentication
      const token = store.getState().auth.accessToken;
      if (token && encryptedConfig.headers) {
        encryptedConfig.headers.Authorization = `Bearer ${token}`;
      }
      return encryptedConfig;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptors (order matters - auth first, then decryption)
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Apply decryption to successful responses
      return decryptResponseInterceptor(response);
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 errors
      if (error.response?.status === 401) {
        const errorMessage =
          (error.response?.data as { message?: string })?.message ||
          'Unauthorized';

        // If the error is due to invalid credentials, reject immediately
        if (originalRequest.url === API.AUTH.LOGIN) {
          return Promise.reject(new Error(errorMessage));
        }

        // Token refresh logic
        if (!originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                }
                return axiosInstance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const currentRefreshToken = store.getState().auth.refreshToken;
            if (!currentRefreshToken) {
              throw new Error('No refresh token available');
            }

            const refreshUrl = API.AUTH.REFRESH_TOKEN;
            const response = await axiosInstance.get<RefreshTokenResponse>(
              refreshUrl,
              {
                params: { refreshToken: currentRefreshToken },
                // Skip encryption for refresh token requests to avoid circular dependencies
                skipEncryption: true,
                headers: {
                  'X-Skip-Encryption': 'true',
                },
              }
            );

            const { accessToken } = response.data.data;
            store.dispatch(updateAccessToken(accessToken));
            processQueue(null, accessToken);

            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] =
                `Bearer ${accessToken}`;
            }
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            store.dispatch(logout());
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
      }

      return Promise.reject(error);
    }
  );
};
