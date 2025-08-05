import { TransactionFormData } from '../components/transaction-form/transaction-form.schema';
import { Option } from '../components/transaction-form/transaction-form.types';
import { CreateTransactionRequest } from '../types/create-transaction.types';
import { PartialUpdateOrderRequest } from '../types/update-order.types';

/**
 * Transform form data to API request format
 */
export const transformFormDataToApiRequest = (
  formData: TransactionFormData,
  // transactionTypes: Array<Option>,
  watchedTransactionTypeHashKey: string,
  // purposeTypes: Array<Option>
  watchedPurposeTypeDocId: string
): CreateTransactionRequest => {
  return {
    partner_order_id: formData.applicantDetails.partnerOrderId || '',
    transaction_type_id: watchedTransactionTypeHashKey || '',
    is_e_sign_required: true, // Always true as per requirement
    is_v_kyc_required: formData.applicantDetails.isVKycRequired || false,
    purpose_type_id: watchedPurposeTypeDocId || '',
    customer_name: formData.applicantDetails.applicantName || '',
    customer_email: formData.applicantDetails.email || '',
    customer_phone: formData.applicantDetails.mobileNumber || '',
    customer_pan: formData.applicantDetails.applicantPanNumber || '',
    paid_by: formData.applicantDetails.paidBy || '',
  };
};

/**
 * Transform form data to update order request format
 * Only includes the fields that can be updated in edit mode
 */
export const transformFormDataToUpdateRequest = (
  formData: TransactionFormData,
  transactionTypes: Array<Option>,
  purposeTypes: Array<Option>,
  currentUserId: string
): PartialUpdateOrderRequest => {
  // Find the transaction type ID by matching the text
  const selectedTransactionType = transactionTypes.find(
    (type) => type.value === formData.applicantDetails.transactionType
  );

  // Find the purpose type ID by matching the text
  const selectedPurposeType = purposeTypes.find((type) => type.value === formData.applicantDetails.purposeType);

  return {
    transaction_type: selectedTransactionType?.typeId || '',
    purpose_type: selectedPurposeType?.typeId || '',
    is_v_kyc_required: formData.applicantDetails.isVKycRequired || false,
    customer_name: formData.applicantDetails.applicantName || '',
    customer_email: formData.applicantDetails.email || '',
    customer_phone: formData.applicantDetails.mobileNumber || '',
    customer_pan: formData.applicantDetails.applicantPanNumber || '',
    updated_by: currentUserId,
  };
};
