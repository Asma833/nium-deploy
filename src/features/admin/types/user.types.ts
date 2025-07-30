import { FormField } from '@/types/common.type';
import { FieldType } from '@/types/enums';

export type UserCreationRequest = {
  role_id: string;
  is_active?: boolean;
  hashed_key?: string;
  email?: string;
  password: string;
  business_type?: string;
  branch_id?: string;
  bank_account_id?: string;
};

export type UserStatusRequest = {
  is_active: boolean;
  hashed_key: string;
};

export type UserUpdateRequest = {
  hashed_key: string;
  email: string;
  password: string;
};

export type UserCreationResponse = {
  success: boolean;
  message: string;
};

export type UserFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  businessType: string;
  created_by?: string;
  updated_by?: string;
};

export type UserRequest = {
  role_id: string;
  email: string;
  password: string;
  business_type: string;
  created_by?: string;
  updated_by?: string;
  branch_id: string;
  bank_account_id: string;
  role?: string;
};

export type User = {
  id: string;
  email: string;
  hashed_key: string;
  role_id: string;
  branch_id: string;
  bank_account_id: string;
  is_active: boolean;
  business_type: string;
  created_by: string | null;
  updated_by: string | null;
  role: {
    id: string;
    name: string;
  };
  branch: {
    id: string;
    name: string;
  };
  bank_account: {
    id: string;
    account_number: string;
    ifsc_code: string;
    bank_name: string;
    bank_branch: string;
  };
};

export type TableColumn = {
  key: string;
  id: string;
  name: string;
  cell?: (value: any, row: any) => React.ReactNode;
};

export type HandleStatusChange = (row: any, checked: boolean) => void;

export type HandleNavigate = (path: string, rowData: string) => void;

export type CheckboxField = FormField & {
  options: Record<string, { label: string; checked: boolean }>;
  isMulti: boolean;
};

export type SelectField = FormField & {
  type: FieldType.Select;
  options: Record<string, { label: string; selected?: boolean }>;
  isMulti: boolean;
};

export type Field = FormField | SelectField;

export type Fields = {
  email: Field;
  password: Field;
  confirmPassword: Field;
  businessType: any;
};

export type UserFormConfig = {
  sectionTitle: string;
  fields: Fields;
};
