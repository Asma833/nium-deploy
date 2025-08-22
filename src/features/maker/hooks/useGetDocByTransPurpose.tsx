import { API } from '@/core/constant/apis';
import { queryKeys } from '@/core/constant/queryKeys';
import { useGetData } from '@/hooks/useGetData';
import { DocumentsByMappedId } from '../components/transaction-form/transaction-form.types';

type Props = {
  mappedDocPurposeId?: string;
};

const useGetDocByTransPurpose = (props: Props) => {
  const enabled = !!props.mappedDocPurposeId;

  // Only create the endpoint if we have a valid mappedDocPurposeId
  const endpoint = props.mappedDocPurposeId ? API.TRANSACTION_PURPOSE_MAP.GET_DOCUMENTS(props.mappedDocPurposeId) : '';

  const { data, isLoading, refetch, error } = useGetData<DocumentsByMappedId[]>({
    endpoint,
    queryKey: enabled ? queryKeys.transaction.getMappedDocuments : ['disabled-doc-fetch'],
    dataPath: 'data',
    enabled,
  });

  return {
    docsByTransPurpose: data || [],
    isLoading,
    refetch,
    error: !!error,
  };
};

export default useGetDocByTransPurpose;
