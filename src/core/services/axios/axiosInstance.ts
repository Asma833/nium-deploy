import { getBaseUrl } from "@/core/constant/apis";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "@/store"; // Import from your existing store file
import { logout, updateAccessToken } from "@/features/auth/store/authSlice"; // Import auth actions

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

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: getBaseUrl() || "", // Add fallback to empty string
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Process the queue of failed requests
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

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Redux store instead of cookies
    const token = store.getState().auth.accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        // Wait for the refresh process to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get the current refresh token from Redux store
        const currentRefreshToken = store.getState().auth.refreshToken;

        if (!currentRefreshToken) {
          throw new Error("No refresh token available");
        }
        const refreshUrl = `${getBaseUrl()}/refresh/accessToken`;
        // Refresh the token using GET request with query parameter
        const response = await axios.get<RefreshTokenResponse>(refreshUrl, {
          params: { refreshToken: currentRefreshToken },
        });

        const { accessToken } = response.data.data;
        // Update Redux store with the new access token
        store.dispatch(updateAccessToken(accessToken));

        // Process the failed requests
        processQueue(null, accessToken);
       
        // Retry the original request with the new token
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear tokens on refresh failure by dispatching logout action
        store.dispatch(logout());

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to test token refresh manually
export const testTokenRefresh = async () => {
  try {
    // Create an intentional 401 request
    await axiosInstance.get("/test-auth-endpoint", {
      headers: {
        Authorization: "Bearer invalid_token_to_force_401",
      },
    });
  } catch (error) {
    return {
      refreshAttempted: true,
      error: error,
    };
  }
  return {
    refreshAttempted: false,
    error: null,
  };
};

export default axiosInstance;
