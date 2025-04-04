import axiosInstance from "@/core/services/axios/axiosInstance";
import { useQuery } from "@tanstack/react-query";

type QueryConfig<T> = {
  endpoint: string;
  id?: string;
  queryKey: string[];
  dataPath?: string;
  enabled?: boolean;
};

type QueryResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch?: () => Promise<any>;
};

export const useGetData = <T,>({
  endpoint,
  id,
  queryKey,
  dataPath = "",
  enabled = true,
}: QueryConfig<T>): QueryResult<T> => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (id && !endpoint.includes(id)) {
        endpoint = `${endpoint}/${id}`;
      }
      const response = await axiosInstance.get(endpoint);

      if (!dataPath) {
        return response.data;
      }

      return dataPath.split(".").reduce((obj, key) => obj?.[key], response.data) ?? null;
    },
    enabled: enabled && (!id || !!id),
  });

  return {
    data: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};

/**
 * Usage in component:

  export const useGetFeedbacks = (
    requestId?: string,
    enabled: boolean = true
  ) => {
  return useGetData({
    endpoint: API_ENDPOINTS.getFeedbacks,
    id: requestId,
    queryKey: ["fetchFeedbacks", requestId || ""],
    dataPath: "data.submittedFeedback",
    enabled,
  });
};
const { data, isLoading, error } = useGetData({ ... });


*/
