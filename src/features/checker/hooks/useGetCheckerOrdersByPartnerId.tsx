import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { Order, CheckerOrdersResponse } from '../types/updateIncident.types';

export const useGetCheckerOrdersByPartnerId = (partnerOrderId: string, autoFetch: boolean = true) => {
  // Get the current user once
  const { user } = useCurrentUser();
  const userHashedKey = user?.hashed_key;
  // Define query key with user and partner-specific identifiers to prevent cache conflicts
  const queryKey = ['checkerOrdersByPartnerId', userHashedKey, partnerOrderId];

  // Use TanStack Query for data fetching
  const {
    data,
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userHashedKey) {
        throw new Error('User hash key not available');
      }

      const { data } = await axiosInstance.post(API.ORDERS.CHECKER_ORDERS_BY_PARTNER_ID, {
        checkerId: userHashedKey,
        partner_order_id: partnerOrderId,
      }); // Return the order from the response, not the entire response
      const response = data as CheckerOrdersResponse;
      return response.order as Order;
    },
    enabled: autoFetch && !!userHashedKey && !!partnerOrderId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Function to manually trigger a refetch
  const fetchData = useCallback(() => {
    if (!userHashedKey) {
      toast.error('Error Fetching Checker Orders', {
        description: 'User hash key not available',
      });
      return;
    }

    if (!partnerOrderId) {
      toast.error('Error Fetching Checker Orders', {
        description: 'Partner order ID not available',
      });
      return;
    }

    refetch();
  }, [userHashedKey, partnerOrderId, refetch]);

  return {
    data,
    loading,
    error,
    fetchData,
  };
};

export default useGetCheckerOrdersByPartnerId;
