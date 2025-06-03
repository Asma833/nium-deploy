export enum FieldType {
  Text = 'text',
  Email = 'email',
  Password = 'password',
  Select = 'select',
  Checkbox = 'checkbox',
  FileUpload = 'fileupload',
  Fileupload_View = 'fileupload_view',
}

export type FormField = {
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
};
