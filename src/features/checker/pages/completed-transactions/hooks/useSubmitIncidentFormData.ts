import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';
import { useQueryInvalidator } from '@/hooks/useQueryInvalidator';

// Define the proper type for the form data
interface IncidentFormData {
  partner_order_id: string;
  checker_id: string;
  nium_invoice_number: string;
  incident_checker_comments: string;
  incident_status: boolean;
}

// Define the callbacks type
interface SubmitCallbacks {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const useSubmitIncidentFormData = () => {
  const { invalidateMultipleQueries } = useQueryInvalidator();

  const { mutate, isPending, isError, isSuccess, error, data } = useMutation({
    mutationFn: async (formData: IncidentFormData) => {
      const payload = formData;
      const response = await axiosInstance.post(
        API.ORDERS.UPDATE_ORDER_DETAILS,
        payload
      );
      return response.data;
    },
  });

  // Custom submission function that properly handles callbacks
  const submitIncidentFormData = (
    formData: IncidentFormData,
    callbacks?: SubmitCallbacks
  ) => {
    return mutate(formData, {
      onSuccess: (data) => {
        callbacks?.onSuccess?.(data);
        invalidateMultipleQueries([['updateIncident'], ['dashboardMetrics']]);
      },
      onError: (error) => {
        callbacks?.onError?.(error);
      },
    });
  };

  return {
    submitIncidentFormData,
    isPending,
    isError,
    isSuccess,
    error,
    data,
  };
};

export default useSubmitIncidentFormData;
