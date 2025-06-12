import { TransactionFormData } from '../components/transaction-form/transaction-form.schema';
import { CreateTransactionRequest } from '../types/create-transaction.types';

/**
 * Transform form data to API request format
 */
export const transformFormDataToApiRequest = (
  formData: TransactionFormData,
  transactionTypes: Array<{ id: string; text: string }>,
  purposeTypes: Array<{ id: string; text: string }>
): CreateTransactionRequest => {
  // Find the transaction type ID by matching the text
  const selectedTransactionType = transactionTypes.find(
    (type) => type.text === formData.applicantDetails.transactionType
  );

  // Find the purpose type ID by matching the text
  const selectedPurposeType = purposeTypes.find((type) => type.text === formData.applicantDetails.purposeType);

  return {
    partner_order_id: formData.applicantDetails.partnerOrderId || '',
    transaction_type_id: selectedTransactionType?.id || '',
    is_e_sign_required: true, // Always true as per requirement
    is_v_kyc_required: formData.applicantDetails.isVKycRequired === 'true',
    purpose_type_id: selectedPurposeType?.id || '',
    customer_name: formData.applicantDetails.applicantName || '',
    customer_email: formData.applicantDetails.email || '',
    customer_phone: formData.applicantDetails.mobileNumber || '',
    customer_pan: formData.applicantDetails.applicantPanNumber || '',
  };
};
