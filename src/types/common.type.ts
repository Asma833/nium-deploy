export enum FieldType {
  Text = 'text',
  Number = 'number',
  Date = 'date',
  DateTime = 'datetime',
  Time = 'time',
  Phone = 'phone',
  IndianPhone = 'indian_phone',
  TextArea = 'textarea',
  Radio = 'radio',
  RadioGroup = 'radio_group',
  PasswordConfirm = 'password_confirm',
  PasswordStrength = 'password_strength',
  PasswordStrengthConfirm = 'password_strength_confirm',
  Hidden = 'hidden',
  Color = 'color',
  RichText = 'rich_text',
  RichTextArea = 'rich_text_area',
  Email = 'email',
  Password = 'password',
  Select = 'select',
  Checkbox = 'checkbox',
  FileUpload = 'fileupload',
  Fileupload_View = 'fileupload_view',
  FileUploadWithButton = 'fileupload_with_button',
}

export type FormField = {
  label: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
};
