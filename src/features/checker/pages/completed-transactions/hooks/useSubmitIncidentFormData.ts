import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';
import { useCurrentUser } from '@/utils/getUserFromRedux';

// Define the proper type for the form data
interface IncidentFormData {
  partner_order_id: string;
  checker_id: string;
  nium_invoice_number: string;
  incident_checker_comments: string;
  incident_status: boolean;
}

const useSubmitIncidentFormData = () => {
  const { getUserHashedKey } = useCurrentUser();

  const { mutate, isPending, isError, isSuccess, error, data } = useMutation({
    mutationFn: async (formData: IncidentFormData) => {
      const payload = formData;
      const response = await axiosInstance.post(
        API.ORDERS.UPDATE_ORDER_DETAILS,
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {},
    onError: (error) => {},
  });

  return {
    submitIncidentFormData: mutate,
    isPending,
    isError,
    isSuccess,
    error,
    data,
  };
};

export default useSubmitIncidentFormData;
