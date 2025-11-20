import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createTransactionPurposeMap,
  getMappedDocuments,
  CreateTransactionPurposeMapRequest,
  MappedDocument,
} from '../api/transactionPurposeMapApi';

export const useCreateTransactionPurposeMap = () => {
  return useMutation({
    mutationFn: (data: CreateTransactionPurposeMapRequest) => {
      return createTransactionPurposeMap(data);
    },
    onError: (error: any) => {
      console.error('Transaction purpose mapping creation failed:', error);

      // Check if it's a duplicate mapping error (which might be acceptable)
      const isDuplicateError =
        error?.response?.status === 409 ||
        error?.response?.data?.message?.includes('already exists') ||
        error?.response?.data?.message?.includes('duplicate');

      if (isDuplicateError) {
        console.warn('Mapping already exists, proceeding with document fetch...');
      } else {
        toast.error('Failed to create transaction purpose mapping');
      }
    },
  });
};

export const useGetMappedDocuments = (transactionTypeId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['mapped-documents', transactionTypeId],
    queryFn: () => getMappedDocuments(transactionTypeId),
    enabled: enabled && !!transactionTypeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => response.data.data, // Extract the documents array
  });
};
