import { UserFormConfig } from '@/features/admin/types/user.types';
import { FieldType } from '@/types/enums';

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
