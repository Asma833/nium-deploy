import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { partnerApi } from "../api/partnerApi";

export const useProductOptions = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["productOptions"], // Unique query key
    queryFn: async () => {
      const response = await partnerApi.getProducts();
      return response; 
    },
  });

  if (error) {
    toast.error(error.message || "Failed to fetch product options.");
  }

  return { productOptions: data || [], isLoading, error };
};
