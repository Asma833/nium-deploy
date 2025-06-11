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
      },
      uploadDocuments: {
        pan: {
          id: 'upload-pan-document',
          name: 'uploadDocuments.pan',
          label: 'PAN',
          type: FieldType.Fileupload_View,
          required: true,
          maxFiles: 3,
          description: "Applicant's PAN card copy",
          helpText: 'Upload clear copy of PAN card (front side)',
        },
        passportAadharDrivingVoter: {
          front: {
            id: 'upload-passport-aadhar-driving-voter-front',
            name: 'uploadDocuments.passportAadharDrivingVoter.front',
            label: 'Front',
            type: FieldType.Fileupload_View,
            required: false,
            maxFiles: 1,
            description: 'Front side of Passport/Aadhar/Driving License/Voter ID',
            helpText: 'Upload clear copy of front side of Passport/Aadhar/Driving License/Voter ID',
          },
          back: {
            id: 'upload-passport-aadhar-driving-voter-back',
            name: 'uploadDocuments.passportAadharDrivingVoter.back',
            label: 'Back',
            type: FieldType.Fileupload_View,
            required: false,
            maxFiles: 1,
            description: 'Back side of Passport/Aadhar/Driving License/Voter ID',
            helpText: 'Upload clear copy of back side of Passport/Aadhar/Driving License/Voter ID',
          },
        },
        studentPassport: {
          front: {
            id: 'upload-student-passport-front',
            name: 'uploadDocuments.studentPassport.front',
            label: 'Front',
            type: FieldType.Fileupload_View,
            required: false,
            maxFiles: 1,
            description: 'Front side of student passport (if applicable)',
            helpText: 'Upload clear copy of front side of student passport (if applicable)',
          },
          back: {
            id: 'upload-student-passport-back',
            name: 'uploadDocuments.studentPassport.back',
            label: 'Back',
            type: FieldType.Fileupload_View,
            required: false,
            maxFiles: 1,
            description: 'Back side of student passport (if applicable)',
            helpText: 'Upload clear copy of back side of student passport (if applicable)',
          },
        },
        studentUniversityOfferLetter: {
          id: 'upload-student-university-offer-letter',
          name: 'uploadDocuments.studentUniversityOfferLetter',
          label: 'Valid Student University Offer Letter/I20',
          type: FieldType.Fileupload_View,
          required: false,
          maxFiles: 1,
          description: 'University offer letter for student transactions',
          helpText: 'Upload clear copy of university offer letter (if applicable)',
        },
        studentVisa: {
          id: 'upload-student-visa',
          name: 'uploadDocuments.studentVisa',
          label: 'Valid Student Visa',
          type: FieldType.Fileupload_View,
          required: false,
          maxFiles: 1,
          description: 'Valid student visa copy (if applicable)',
          helpText: 'Upload clear copy of valid student visa (if applicable)',
        },
        payerPan: {
          id: 'upload-payer-pan',
          name: 'uploadDocuments.payerPan',
          label: 'Payer PAN',
          type: FieldType.Fileupload_View,
          required: false,
          maxFiles: 1,
          description: 'Payer PAN card copy (if different from applicant)',
        },
        payerRelationshipProof: {
          id: 'upload-payer-relationship-proof',
          name: 'uploadDocuments.payerRelationshipProof',
          label: 'Payer Relationship Proof',
          type: FieldType.Fileupload_View,
          required: false,
          maxFiles: 1,
          description: 'Proof of relationship between applicant and payer (if applicable)',
        },
        educationLoanDocument: {
          id: 'upload-education-loan-documents',
          name: 'uploadDocuments.educationLoanDocument',
          label: 'Education Loan Documents',
          type: FieldType.Fileupload_View,
          required: false,
          maxFiles: 3,
          description: 'Any documents related to education loan (if applicable)',
        },
        otherDocuments: {
          id: 'upload-other-documents',
          name: 'uploadDocuments.otherDocuments',
          label: 'Other Documents',
          type: FieldType.Fileupload_View,
          required: false,
          maxFiles: 5,
          description: 'Any additional supporting documents related to transaction',
        },
      },
    },
  };
};

// Keep the original export for backward compatibility
export const formControllerMeta = getFormControllerMeta();
