// Default values for the transaction form
export const transactionFormDefaults = {
  applicantDetails: {
    applicantName: '',
    applicantPanNumber: '',
    transactionType: '',
    purposeType: '',
  },
  uploadDocuments: {
    pan: [],
    passportAadharDrivingVoter: {
      front: [],
      back: [],
    },
    studentPassport: {
      front: [],
      back: [],
    },
    studentUniversityOfferLetter: [],
    studentVisa: [],
    payerPan: [],
    payerRelationshipProof: [],
    educationLoanDocument: [],
    otherDocuments: [],
  },
};

export type TransactionFormDefaultValues = typeof transactionFormDefaults;
