import axiosInstance from '@/core/services/axios/axiosInstance';
import { useEffect, useRef, useState } from 'react';
import { Option } from '@/features/maker/components/transaction-form/transaction-form.types';

export const useTransactionPurposeMap = (apiUrl: string) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchOptions = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(apiUrl);

        const formattedOptions = data?.data.map((item: any) => ({
          typeId: item.id,
          label: `${item.transactionType?.name || ''} - ${item.purpose?.purpose_name || ''}`,
          value: `${item.transactionType?.name || ''} - ${item.purpose?.purpose_name || ''}`,
        }));

        setOptions(formattedOptions);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiUrl]);

  return { options, loading, error };
};
