import { TransactionPurposeMap } from '@/features/maker/components/transaction-form/transaction-form.types';
import { FieldType } from '@/types/enums';

export const purposeDocumentFormConfig = ({
  mappedPurposeTransactionTypesData,
  selectedTransactionTypeId,
}: {
  mappedPurposeTransactionTypesData?: TransactionPurposeMap[];
  selectedTransactionTypeId?: string;
}) => {
  // Create unique transaction type options
  const uniqueTransactionTypes = mappedPurposeTransactionTypesData?.reduce(
    (acc, item) => {
      const existingType = acc.find((t) => t.value === item.transactionType.id);
      if (!existingType) {
        acc.push({
          value: item.transactionType.id,
          label: item.transactionType.name,
          typeId: item.id,
        });
      }
      return acc;
    },
    [] as Array<{ value: string; label: string; typeId: string }>
  );

  // Filter purpose types based on selected transaction type
  const purposeTypesForSelectedTransaction = selectedTransactionTypeId
    ? mappedPurposeTransactionTypesData
        ?.filter((item) => item.transactionType.id === selectedTransactionTypeId)
        .map((item) => ({
          value: item.purpose.id,
          label: item.purpose.purpose_name,
          typeId: item.id,
        }))
    : [];

  return {
    sectionTitle: 'Create Document',
    fields: {
      name: {
        label: 'Document Name',
        type: FieldType.Text,
        required: true,
        placeholder: 'Enter Document Name',
      },
      display_name: {
        label: 'Document Display Name',
        type: FieldType.Text,
        required: true,
        placeholder: 'Enter Document Display Name',
      },
      code: {
        label: 'Document Code',
        type: FieldType.Text,
        required: true,
        placeholder: 'Enter Document Code',
      },
      description: {
        label: 'Document Description',
        type: FieldType.TextArea,
        placeholder: 'Enter Document Description',
      },
    },
    documentField: {
      transaction_type: {
        name: 'transaction_type',
        label: 'Select Transaction Type',
        type: FieldType.Select,
        placeholder: 'Select transaction type',
        required: true,
        options: uniqueTransactionTypes || [],
        className: 'w-full p-4',
      },
      purpose_type: {
        name: 'purpose_type',
        label: 'Select Purpose Type',
        type: FieldType.Select,
        placeholder: 'Select purpose type',
        required: true,
        options: purposeTypesForSelectedTransaction || [],
        className: 'w-full p-4',
        disabled: !selectedTransactionTypeId,
      },
    },
  };
};
