import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';

export interface DashboardMetrics {
  transactionReceived: number;
  transactionApproved: number;
  transactionRejected: number;
  transactionPending: number;
  vkycCompleted: number;
  vkycPending: number;
  vkycRejected: number;
  esignCompleted: number;
  esignPending: number;
  esignRejected: number;
}

const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await axiosInstance.get(API.ORDERS.ORDER_STATUS_COUNTS);
  return response.data;
};

export const useGetDashboardCardMetrics = () => {
  return useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: fetchDashboardMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
