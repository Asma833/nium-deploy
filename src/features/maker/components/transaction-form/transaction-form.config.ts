import { FieldType } from '@/types/common.type';
import { FormControllerMetaOptions } from './transaction-form.types';

export const getFormControllerMeta = (
  options: FormControllerMetaOptions = {}
) => {
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
      acc[type.value] = { label: type.label };
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
          options:
            Object.keys(transactionOptions).length > 0
              ? transactionOptions
              : {},
        },
        purposeType: {
          name: 'applicantDetails.purposeType',
          label: 'Purpose',
          type: FieldType.Select,
          required: true,
          placeholder: 'Select Purpose',
          options: Object.keys(purposeOptions).length > 0 ? purposeOptions : {},
        },
      },
      uploadDocuments: {
        panDocument: {
          id: 'upload-pan-document',
          name: 'uploadDocuments.panDocument',
          label: 'PAN Document',
          type: FieldType.Fileupload_View,
          required: true,
          maxFiles: 3,
          description: "Applicant's PAN card copy",
          helpText: 'Upload clear copy of PAN card (front side)',
        },
        passportDocument: {
          id: 'upload-passport-document',
          name: 'uploadDocuments.passportDocument',
          label: 'Passport Document',
          type: FieldType.Fileupload_View,
          required: true,
          maxFiles: 3,
          description: 'Valid passport copy',
          helpText: 'Upload passport pages with photo and details',
        },
        universityOfferLetter: {
          id: 'upload-university-offer-letter',
          name: 'uploadDocuments.universityOfferLetter',
          label: 'University Offer Letter',
          type: FieldType.Fileupload_View,
          required: true,
          maxFiles: 3,
          description: 'Official university admission letter',
          helpText:
            'Upload the official offer/admission letter from university',
        },
        studentVisa: {
          id: 'upload-student-visa',
          name: 'uploadDocuments.studentVisa',
          label: 'Student Visa',
          type: FieldType.Fileupload_View,
          required: true,
          maxFiles: 3,
          description: 'Valid student visa document',
          helpText: 'Upload student visa or I-20 form',
        },
        payerPanDocument: {
          id: 'upload-payer-pan-document',
          name: 'uploadDocuments.payerPanDocument',
          label: 'Payer PAN Document',
          type: FieldType.Fileupload_View,
          required: false,
          maxFiles: 3,
          description: 'PAN card of fee payer (if different from applicant)',
          helpText:
            'Required if someone else is paying the fees, e.g., parent or guardian',
        },
        relationshipProof: {
          id: 'upload-relationship-proof',
          name: 'uploadDocuments.relationshipProof',
          label: 'Relationship Proof',
          type: FieldType.Fileupload_View,
          required: false,
          maxFiles: 3,
          description: 'Proof of relationship with fee payer (if applicable)',
          helpText:
            'Birth certificate, family tree, or affidavit to establish relationship',
        },
        educationLoanDocument: {
          id: 'upload-education-loan-document',
          name: 'uploadDocuments.educationLoanDocument',
          label: 'Education Loan Document',
          type: FieldType.Fileupload_View,
          required: false,
          maxFiles: 3,
          description: 'Education loan sanction letter (if applicable)',
          helpText:
            'Upload loan approval or sanction letter from bank or financial institution',
        },
        otherDocuments: {
          id: 'upload-other-documents',
          name: 'uploadDocuments.otherDocuments',
          label: 'Other Documents',
          type: FieldType.Fileupload_View,
          required: false,
          maxFiles: 5,
          description:
            'Any additional supporting documents related to transaction',
        },
      },
    },
  };
};

// Keep the original export for backward compatibility
export const formControllerMeta = getFormControllerMeta();
