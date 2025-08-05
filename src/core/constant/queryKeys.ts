// queryKeys.ts
export const queryKeys = {
  user: {
    base: ['user'],
    allUsers: ['user', 'all'],
  },
  transaction: {
    base: ['transaction'],
    allTransactions: ['transaction', 'all'],
    transactionTypes: ['transaction', 'types'],
    transactionPurposeMap: ['transaction', 'purposeMap'],
    getMappedDocuments: ['transaction', 'purposeMap', 'documents'],
  },
};
