import { FieldType } from '@/types/enums';
import { FormControllerMetaOptions } from './transaction-form.types';

export const getFormControllerMeta = (options: FormControllerMetaOptions = {}) => {
  const { transactionTypes = [], purposeTypes = [] } = options;

  // Convert arrays to options object format
  const transactionOptions = transactionTypes.reduce(
    (acc, type) => {
      acc[type.value] = { label: type.label };
      return acc;
    },
    {} as Record<string, { label: string; selected?: boolean }>
  );

  const filteredOutPurposesWithSameHashKey = purposeTypes.filter(
    (type, index, self) => index === self.findIndex((t) => t.purposeHashKey === type.purposeHashKey)
  );

  const paidByOptions: Record<string, { label: string; selected?: boolean }> = {
    self: { label: 'Self' },
    father: { label: 'Father' },
    mother: { label: 'Mother' },
    brother: { label: 'Brother' },
    sister: { label: 'Sister' },
    husband: { label: 'Husband' },
    wife: { label: 'Wife' },
  };

  // Set first option as selected if available
  if (transactionTypes.length > 0) {
    transactionOptions[transactionTypes[0].value].selected = true;
  }

  return {
    sectionTitle: 'Create Transaction',
    description: 'Fill in the details to create a new transaction',
    fields: {
      applicantDetails: {
        partnerOrderId: {
          name: 'applicantDetails.partnerOrderId',
          label: 'Partner Order ID',
          type: FieldType.Text,
          required: true,
          placeholder: 'Enter Partner Order ID',
        },
        applicantName: {
          name: 'applicantDetails.applicantName',
          label: 'Applicant Name As Per Aadhar',
          type: FieldType.Text,
          required: true,
          placeholder: 'Enter Applicant Name As Per Aadhar',
        },
        applicantPanNumber: {
          name: 'applicantDetails.applicantPanNumber',
          label: 'Applicant PAN Number',
          type: FieldType.Text,
          required: true,
          placeholder: 'Enter Applicant PAN Number',
          uppercase: true,
        },
        transactionType: {
          name: 'applicantDetails.transactionType',
          label: 'Transaction Type',
          type: FieldType.Select,
          required: true,
          placeholder: 'Select Transaction Type',
          options: Object.keys(transactionOptions).length > 0 ? transactionOptions : {},
        },
        purposeType: {
          name: 'applicantDetails.purposeType',
          label: 'Purpose',
          type: FieldType.Select,
          required: true,
          placeholder: 'Select Purpose',
          options: Object.keys(filteredOutPurposesWithSameHashKey).length > 0 ? filteredOutPurposesWithSameHashKey : {},
        },
        paidBy: {
          name: 'applicantDetails.paidBy',
          label: 'Paid By',
          type: FieldType.Select,
          required: true,
          placeholder: 'Select Paid By',
          options: Object.keys(paidByOptions).length > 0 ? paidByOptions : {},
        },
        email: {
          name: 'applicantDetails.email',
          label: 'Email',
          type: FieldType.Email,
          required: true,
          placeholder: 'Enter Email Address',
        },
        mobileNumber: {
          name: 'applicantDetails.mobileNumber',
          label: 'Mobile Number',
          type: FieldType.Phone,
          required: true,
          placeholder: 'Enter Mobile Number',
        },
        isVKycRequired: {
          name: 'applicantDetails.isVKycRequired',
          label: 'Is V-KYC Required?',
          type: FieldType.Radio,
          required: true,
          placeholder: '',
          options: {
            true: { label: 'Yes' },
            false: { label: 'No' },
          },
        },
      },
    },
  };
};

// Keep the original export for backward compatibility
export const formControllerMeta = getFormControllerMeta();
