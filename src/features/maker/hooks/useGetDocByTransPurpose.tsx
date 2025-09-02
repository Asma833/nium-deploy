import { API } from '@/core/constant/apis';
import { queryKeys } from '@/core/constant/queryKeys';
import { useGetData } from '@/hooks/useGetData';
import { DocumentsByMappedId } from '../components/transaction-form/transaction-form.types';

// Stable empty array to avoid recreating [] on each render when disabled/no data
const EMPTY_DOCS: DocumentsByMappedId[] = [];

type Props = {
  mappedDocPurposeId?: string | undefined;
};

const useGetDocByTransPurpose = (props: Props = {}) => {
  const enabled = !!props.mappedDocPurposeId && props.mappedDocPurposeId.trim() !== '';

  // Only create the endpoint if we have a valid mappedDocPurposeId
  const endpoint = enabled ? API.TRANSACTION_PURPOSE_MAP.GET_DOCUMENTS(props.mappedDocPurposeId!) : '';

  const { data, isLoading, refetch, error } = useGetData<DocumentsByMappedId[]>({
    endpoint,
    queryKey: enabled ? queryKeys.transaction.getMappedDocuments : ['disabled-doc-fetch'],
    dataPath: 'data',
    enabled,
  });

  // Use a stable empty array reference when there's no data
  const docs = data && Array.isArray(data) ? data : EMPTY_DOCS;

  return {
    docsByTransPurpose: docs,
    isLoading,
    refetch,
    error: !!error,
  };
};

export default useGetDocByTransPurpose;
