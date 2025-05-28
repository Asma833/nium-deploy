import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';
import { DashboardMetrics } from '../types/checker.types';

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
