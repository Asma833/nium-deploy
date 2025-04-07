import axiosInstance from '@/core/services/axios/axiosInstance';
import {
  useMutation,
  UseMutationResult,
  UseMutationOptions,
} from '@tanstack/react-query';

type MutationConfig<TData, TVariables> = {
  requestId?: string;
  endpoint: string;
  onSuccess?: (data: TData, variables: TVariables, context: unknown) => unknown;
  onError?: (error: Error, variables: TVariables, context: unknown) => unknown;
};

export const usePostData = <TData, TVariables>({
  requestId,
  endpoint,
  onSuccess = () => {},
  onError = () => {},
}: MutationConfig<TData, TVariables>): UseMutationResult<
  TData,
  Error,
  TVariables
> => {
  const endpointurl = requestId ? `${endpoint}/${requestId}` : endpoint;

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const { data } = await axiosInstance.post(endpointurl, variables);
      return data;
    },
    onSuccess,
    onError,
  } as UseMutationOptions<TData, Error, TVariables>);
};

/**
Usage in component:

const FeedbackComponent = () => {
  const { mutate, isLoading } = useFeedbackSubmission();

  const handleSubmit = () => {
    mutate({
      message: 'Great service!',
      rating: 5,
      userId: 'user123'
    });
  };
  return <button onClick={handleSubmit} disabled={isLoading}>Submit</button>;
};

 */
