export type DocumentConfig = {
  id: string;
  label: string;
  required: boolean;
  maxFiles: number;
  description?: string;
  helpText?: string;
};

export interface OptionType {
  id: string | number;
  label: string;
  value: string;
}

export interface FormControllerMetaOptions {
  transactionTypes?: OptionType[];
  purposeTypes?: OptionType[];
}
