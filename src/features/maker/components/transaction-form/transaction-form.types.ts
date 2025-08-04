import { TransactionMode } from '@/types/enums';

export type DocumentConfig = {
  id: string;
  label: string;
  required: boolean;
  maxFiles: number;
  description?: string;
  helpText?: string;
};

export type OptionType = {
  id?: string;
  label: string;
  value: string;
  purposeHashKey?: string;
  typeId?: string;
  transactionPurposeMapId?: string;
};

export type Option = TransactionPurposeMap & {
  id?: string;
  typeId: string;
  label: string;
  value: string;
  hashedKey?: string;
  purposeHashKey?: string;
  transactionPurposeMapId?: string;
};

export type FormControllerMetaOptions = {
  transactionTypes?: OptionType[];
  purposeTypes?: OptionType[];
};

export type TransactionFormProps = {
  mode?: TransactionMode;
};

export type TransactionPurposeMap = {
  id: string;

  transaction_type_id: string;
  transaction_purpose_map_id?: string;
  purpose_id: string;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  transactionType: {
    id: string;
    hashed_key: string;
    name: string;
    isActive: boolean;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
  };
  purpose: {
    id: string;
    hashed_key: string;
    purpose_name: string;
    purpose_code: string;
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
  };
};

export type DocumentsByMappedId = {
  id: string;
  document_id: string;
  name: string;
  display_name: string | null;
  code: string;
  is_back_required: boolean;
  is_mandatory: boolean;
};
