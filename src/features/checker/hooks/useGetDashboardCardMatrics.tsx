import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';
import { DashboardMetrics } from '../types/checker.types';
import { useCurrentUser } from '@/utils/getUserFromRedux';

const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await axiosInstance.get(API.ORDERS.ORDER_STATUS_COUNTS);
  return response.data;
};

export const useGetDashboardCardMetrics = () => {
  const { getUserHashedKey } = useCurrentUser();
  const userHashedKey = getUserHashedKey();

  return useQuery({
    queryKey: ['dashboardMetrics', userHashedKey],
    queryFn: fetchDashboardMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    enabled: !!userHashedKey, // Only fetch when user is available
  });
};
