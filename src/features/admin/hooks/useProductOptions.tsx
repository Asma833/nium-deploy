import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { partnerApi } from '../action/partnerApi';

interface ProductOption {
  id: string;
  name: string;
}

export const useProductOptions = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['productOptions'],
    queryFn: async () => {
      const response = await partnerApi.getProducts();
      // Transform the response to match the expected format
      if (Array.isArray(response)) {
        return response.filter((product): product is ProductOption => {
          const isValid = 'id' in product && 'name' in product;
          if (!isValid) {
            console.warn('Invalid product format in API response:', product);
          }
          return isValid;
        });
      }
      // If response is not an array, return empty array
      console.warn('Unexpected API response format:', response);
      return [];
    },
  });

  if (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to fetch product options.');
  }

  return { productOptions: data || [], isLoading, error };
};
