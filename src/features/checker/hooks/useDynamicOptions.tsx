import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/core/services/axios/axiosInstance';
import {Option} from '@/features/maker/components/transaction-form/transaction-form.types';

export const useDynamicOptions = (apiUrl: string) => {
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
        const options = data.data ? data.data : data;
        const formattedOptions = options?.map((item: any) => ({
          typeId: item.transaction_type_id || item.id,
          label: item.transaction_name || item.purpose_name,
          value: item.transaction_name || item.purpose_name,
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
