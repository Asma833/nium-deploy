import { TransactionPurposeMap } from '@/features/maker/components/transaction-form/transaction-form.types';
import { FieldType } from '@/types/enums';

export const purposeDocumentFormConfig = (transactionPurposeTypeOptions: TransactionPurposeMap[] = []) => ({
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
      required: true,
      placeholder: 'Enter Document Description',
    },
  },
  documentField: {
    transaction_type: {
      name: 'transaction_type',
      label: 'Select Transaction-Purpose',
      type: FieldType.Select,
      placeholder: 'Select transaction-purpose type',
      required: true,
      options: transactionPurposeTypeOptions,
      className: 'w-full p-4',
    },
  },
});
