import { useState } from 'react';
import axios from 'axios';

interface UseTakeRequestProps {
  endpoint: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export function useTakeRequest({ endpoint, onSuccess, onError }: UseTakeRequestProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const takeRequest = async (transactionIds: string[]) => {
    if (transactionIds.length === 0) {
      const err = new Error('No transactions selected');
      setError(err);
      onError?.(err);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(endpoint, {
        transactionIds,
      });

      onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      setError(err);
      onError?.(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    takeRequest,
    isSubmitting,
    error,
  };
}
