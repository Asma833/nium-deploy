import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/core/services/axios/axiosInstance';
import { API } from '@/core/constant/apis';
import { useCurrentUser } from '@/utils/getUserFromRedux';

interface IncidentFormData {
  partner_order_id: string;
  incidentform: {
    niumInvoiceNo: string;
    comments: string;
    status: {
      approve: boolean;
      reject: boolean;
    };
  };
}

interface IncidentPayload {
  partner_order_id: string;
  checker_id: string;
  nium_invoice_number: string;
  incident_checker_comments: string;
  incident_status: boolean;
}

const useSubmitIncidentFormData = () => {
  const { getUserHashedKey } = useCurrentUser();

  const createPayload = (formData: IncidentFormData): IncidentPayload => {
    const currentUserHashedKey = getUserHashedKey();
    
    return {
      partner_order_id: formData.partner_order_id,
      checker_id: currentUserHashedKey || '',
      nium_invoice_number: formData.incidentform.niumInvoiceNo,
      incident_checker_comments: formData.incidentform.comments,
      incident_status: formData.incidentform.status.approve,
    };
  };

  const { mutate, isPending, isError, isSuccess, error, data } = useMutation({
    mutationFn: async (formData: IncidentFormData) => {
      const payload = createPayload(formData);
      const response = await axiosInstance.post(API.ORDERS.UPDATE_ORDER_DETAILS, payload);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Incident form submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Error submitting incident form:', error);
    }
  });

  return {
    submitIncidentFormData: mutate,
    isPending,
    isError,
    isSuccess,
    error,
    data
  };
};

export default useSubmitIncidentFormData;
