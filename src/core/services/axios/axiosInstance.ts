import axios from 'axios';
import { setupInterceptors } from './interceptor';
import { HEADER_KEYS } from '@/core/constant/apis';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
    partner_id: HEADER_KEYS.PARTNER_ID,
  },
});

setupInterceptors(axiosInstance);

export default axiosInstance;
