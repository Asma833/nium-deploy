import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/core/services/axios/axiosInstance";
import { API } from "@/core/constant/apis";
import { toast } from "sonner";
import axios from "axios";

export const useGetOrders = <T = any>(autoFetch: boolean = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data
  const fetchData = useCallback(
    async (queryParams?: Record<string, any>) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosInstance.get(API.ORDERS.LIST, {
          params: queryParams,
        });

        setData(data);
      } catch (err) {
        console.error(`Error fetching orders:`, err);

        // More detailed error logging for authentication issues
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.error("Authentication error - token issue detected");
        }

        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        toast.error("Error Fetching Orders", {
          description: errorMessage,
        });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { data, loading, error, fetchData };
};
