import axios from 'axios';
import { setupInterceptors } from './interceptor';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(axiosInstance);

export default axiosInstance;
