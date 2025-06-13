import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API, HEADER_KEYS } from '@/core/constant/apis';

export interface DocumentTypeItem {
  id: string;
  text: string;
}

/**
 * Fetches document types from the API with proper headers
 * @returns Promise that resolves to an array of document types
 */
const fetchDocumentTypes = async (): Promise<DocumentTypeItem[]> => {
  try {
    const response = await axiosInstance.get(API.CONFIG.GET_DOCUMENT_TYPES, {
      headers: {
        accept: 'application/json',
        api_key: HEADER_KEYS.API_KEY,
        partner_id: HEADER_KEYS.PARTNER_ID,
      },
    });

    // Check if response and response.data exist before returning
    if (response && response.data) {
      return Array.isArray(response.data) ? response.data : [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching document types:', error);
    return [];
  }
};

/**
 * Custom hook to get document type text by ID or fetch all document types
 * Uses TanStack Query for efficient data fetching with caching
 * @param id Optional document type ID to look up
 * @returns Object containing found document type text and loading state
 */
const useGetDocumentTypes = (id?: string) => {
  const {
    data: documentTypes = [],
    isLoading: loading,
    error,
    isError,
  } = useQuery<DocumentTypeItem[], Error>({
    queryKey: ['documentTypes'],
    queryFn: fetchDocumentTypes,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 1,
  });

  // Find the document type name if ID is provided
  const documentType = id ? documentTypes.find((item) => item.id === id)?.text || null : null;

  return {
    documentType,
    documentTypes,
    loading,
    error: isError ? error : null,
  };
};

export default useGetDocumentTypes;
