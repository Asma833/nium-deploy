import { TransactionOptions } from '@/features/maker/components/transaction-form/transaction-form.types';

export const transactionMappingFormConfig = (options: TransactionOptions = {}) => {
  const { transactionTypes = [] } = options;

  // // Convert arrays to options object format
  const transactionOptions = transactionTypes.reduce(
    (acc, type) => {
      acc[type.value] = { label: type.label };
      return acc;
    },
    {} as Record<string, { label: string; selected?: boolean }>
  );
  return {
    formName: 'transactionMappingForm',
    fields: {
      transaction_name: {
        name: 'transaction_name',
        label: 'Transaction Type',
        type: 'select',
        options: transactionOptions ?? {},
        required: true,
      },
    },
  };
};
