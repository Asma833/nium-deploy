enum FieldType {
  Text = 'text',
  Email = 'email',
  Password = 'password',
  Select = 'select',
}

interface FormField {
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
}

interface CheckboxField extends FormField {
  options: Record<string, { label: string; checked: boolean }>;
  isMulti: boolean;
}

interface SelectField extends FormField {
  type: FieldType.Select;
  options: Record<string, { label: string; selected?: boolean }>;
  isMulti: boolean;
}

type Field = FormField | SelectField;

type Fields = {
  email: Field;
  password: Field;
  confirmPassword: Field;
  businessType: any;
};

interface UserFormConfig {
  sectionTitle: string;
  fields: Fields;
}

export const userFormConfig: UserFormConfig = {
  sectionTitle: 'Create User',
  fields: {
    email: {
      label: 'Email',
      type: FieldType.Email,
      required: true,
      placeholder: 'Enter Email',
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
  },
};
