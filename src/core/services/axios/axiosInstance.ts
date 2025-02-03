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

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
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

        const { data } = await axios.post(`${API_URL}/token`, { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        toast.error("Session expired", {
          description: "Please login again"
        });
        localStorage.clear();
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.data?.error) {
      toast.error("Error", {
        description: error.response.data.error
      });
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosInstance;
