import { getEndpoint } from "@/core/constant/apis";
import axios from "axios";
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_ENV === 'production' 
  ? import.meta.env.VITE_APP_API_URL_PROD 
  : import.meta.env.VITE_APP_API_URL_DEV;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 50000, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add these interceptor IDs
const requestInterceptorId = axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const responseInterceptorId = axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.code === "ECONNABORTED") {
      toast.error("Request timed out", {
        description: "Please check your connection and try again"
      });
      return Promise.reject(new Error("Request timed out"));
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Use a new axios instance for refresh to avoid interceptor loop
        const response = await axios.create().post(
          `${API_URL}${getEndpoint('AUTH.REFRESH_TOKEN')}`,
          { refreshToken },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        const { data } = response;

        if (!data.accessToken || !data.refreshToken) {
          throw new Error('Invalid token refresh response');
        }

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Use window.location.replace instead of href for cleaner navigation
        localStorage.clear();
        window.location.replace('/login');
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

// Add cleanup function
export const cleanupAxiosInterceptors = () => {
  axiosInstance.interceptors.request.eject(requestInterceptorId);
  axiosInstance.interceptors.response.eject(responseInterceptorId);
};

export default axiosInstance;
