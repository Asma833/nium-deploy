import { FieldType } from '@/types/common.type';
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

  const purposeOptions = purposeTypes.reduce(
    (acc, type) => {
      // Convert the label to title case
      acc[type?.value] = { label: type?.label };
      return acc;
    },
    {} as Record<string, { label: string; selected?: boolean }>
  );

  // Set first option as selected if available
  if (transactionTypes.length > 0) {
    transactionOptions[transactionTypes[0].value].selected = true;
  }
  if (purposeTypes.length > 0) {
    purposeOptions[purposeTypes[0].value].selected = true;
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
          label: 'Applicant Name',
          type: FieldType.Text,
          required: true,
          placeholder: 'Enter Applicant Name',
        },
        applicantPanNumber: {
          name: 'applicantDetails.applicantPanNumber',
          label: 'Applicant PAN Number',
          type: FieldType.Text,
          required: true,
          placeholder: 'Enter Applicant PAN Number',
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
          options: Object.keys(purposeOptions).length > 0 ? purposeOptions : {},
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
