import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "@/core/services/axios/axiosInstance";
import { API } from "@/core/constant/apis";
import { toast } from "sonner";
import axios from "axios";
import { useCurrentUser } from "@/utils/getUserFromRedux";

type TransactionType = "all" | "completed";

export const useGetCheckerOrders = <T = any>(
  initialTransactionType: TransactionType = "all",
  autoFetch: boolean = true
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>(initialTransactionType);
  
  // Get the current user once
  const { user } = useCurrentUser();
  const userHashedKey = user?.hashed_key;
  
  // Use a ref to store the latest transaction type to avoid dependencies
  const transactionTypeRef = useRef(transactionType);
  transactionTypeRef.current = transactionType;

  // Function to fetch data with POST request
  const fetchData = useCallback(async () => {
    if (!userHashedKey) {
      setError("User hash key not available");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axiosInstance.post(API.ORDERS.CHECKER_ORDERS, {
        checkerId: userHashedKey,
        transaction_type: transactionTypeRef.current
      });

      setData(data);
    } catch (err) {
      console.error(`Error fetching checker orders:`, err);

      // More detailed error logging for authentication issues
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        console.error("Authentication error - token issue detected");
      }

      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      toast.error("Error Fetching Checker Orders", {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userHashedKey]);

  // Functions to change transaction type and fetch data again
  const changeTransactionType = useCallback((newType: TransactionType) => {
    return () => {
      setTransactionType(newType);
      // We'll rely on the effect to trigger the fetch
    };
  }, []);

  // Watch for transaction type changes to trigger a new fetch
  useEffect(() => {
    if (loading) return; // Prevent double fetching when autoFetch is true
    fetchData();
  }, [transactionType, fetchData]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { 
    data, 
    loading, 
    error, 
    fetchData,
    transactionType, 
    getAllTransactions: changeTransactionType("all"),
    getCompletedTransactions: changeTransactionType("completed")
  };
};

export default useGetCheckerOrders;