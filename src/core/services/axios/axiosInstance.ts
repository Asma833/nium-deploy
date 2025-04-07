import axios from 'axios';
import { getBaseUrl } from '@/core/constant/apis';
import { setupInterceptors } from './interceptor';

const axiosInstance = axios.create({
  baseURL: getBaseUrl() || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(axiosInstance);

export default axiosInstance;
