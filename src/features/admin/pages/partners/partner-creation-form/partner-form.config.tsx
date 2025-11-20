import { FieldType } from '@/types/enums';

interface FormField {
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
}

interface CheckboxField extends FormField {
  type: FieldType.Checkbox;
  options: Record<string, { label: string; checked: boolean }>;
  isMulti: boolean;
}

interface SelectField extends FormField {
  type: FieldType.Select;
  options: Record<string, { label: string; selected?: boolean }>;
  isMulti: boolean;
}

type Field = FormField | CheckboxField | SelectField;

type Fields = {
  firstName: Field;
  lastName: Field;
  email: Field;
  password: Field;
  confirmPassword: Field;
  productType: CheckboxField;
  businessType: any;
};

interface UserFormConfig {
  sectionTitle: string;
  fields: Fields;
}

export const userFormConfig: UserFormConfig = {
  sectionTitle: 'Create User',
  fields: {
    firstName: {
      label: 'First Name',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter First Name',
    },
    lastName: {
      label: 'Last Name',
      type: FieldType.Text,
      required: true,
      placeholder: 'Enter Last Name',
    },
    email: {
      label: 'Email',
      type: FieldType.Email,
      required: true,
      placeholder: 'Enter Email',
    },
    password: {
      label: 'Password',
      type: FieldType.Password,
      required: true,
      placeholder: 'Enter Password',
    },
    confirmPassword: {
      label: 'Confirm Password',
      type: FieldType.Password,
      required: true,
      placeholder: 'Confirm Password',
    },
    productType: {
      label: 'Product Type',
      type: FieldType.Checkbox,
      required: true,
      placeholder: '',
      options: {
        card: { label: 'Card', checked: true },
        remittance: { label: 'Remittance', checked: false },
        both: { label: 'Both', checked: false },
      },
      isMulti: false,
    },
    businessType: {
      label: 'Business Type',
      type: FieldType.Text,
      placeholder: 'Select Business Type',
      required: true,
      options: {
        large_enterprise: { label: 'Large Enterprise', selected: true },
      },
      isMulti: false,
    },
  },
};
