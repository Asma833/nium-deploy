import { API } from '@/core/constant/apis';
import { useGetData } from './useGetData';

interface Product {
  id: string;
  hashed_key: string;
  name: string;
  description: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
}

interface ProductKeyMap {
  card: string;
  remittance: string;
}

export const useGetProducts = () => {
  const { data, isLoading, error, refetch } = useGetData<Product[]>({
    endpoint: API.PRODUCTS.GET_PRODUCTS,
    queryKey: ['products'],
  });

  // const getProductIds = () => {
  //   if (!data) return { card: '', remittance: '' };
  //   return data.reduce((acc, product) => {
  //     acc[product.name.toLowerCase()] = product.id;
  //     return acc;
  //   }, {} as ProductKeyMap);
  // };

  const getProductIds = () => {
    if (!data) return { card: '', remittance: '' };

    const mapping: Partial<ProductKeyMap> = {};

    data.forEach((product) => {
      const key = product.name.toLowerCase() as keyof ProductKeyMap;
      mapping[key] = product.id;
    });

    return mapping as ProductKeyMap;
  };

  const getProductHashKey = () => {
    if (!data) return { card: '', remittance: '' };

    const mapping: Partial<ProductKeyMap> = {};

    data.forEach((product) => {
      const key = product.name.toLowerCase() as keyof ProductKeyMap;
      mapping[key] = product.hashed_key;
    });

    return mapping as ProductKeyMap;
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    getProductIds,
    getProductHashKey,
  };
};
