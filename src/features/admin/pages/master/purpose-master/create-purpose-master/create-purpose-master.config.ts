import { FieldType } from '@/types/enums';

export const purposeMasterConfig = {
  title: 'Purpose Master',
  description: 'Manage the purposes for the application',
  fields: {
    purpose_name: {
      name: 'purpose_name',
      label: 'Purpose Name',
      type: FieldType.Text,
      placeholder: 'Enter purpose name',
      required: true,
    },
    purpose_code: {
      name: 'purpose_code',
      label: 'Purpose Code',
      type: FieldType.Text,
      placeholder: 'Enter purpose code',
      required: true,
    },
    transaction_type: {
      name: 'transaction_type',
      label: 'Transaction Type',
      type: FieldType.Select,
      placeholder: 'Select transaction type',
      required: true,
    },
  },
};
