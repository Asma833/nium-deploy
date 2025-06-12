import { MaterialText } from '@/components/form/controller/MaterialText';
import { MaterialSelect } from '@/components/form/controller/MaterialSelect';
import { MaterialDatePicker } from '@/components/form/controller/MaterialDatePicker';
import { MaterialRadioGroup } from '@/components/form/controller/MaterialRadioGroup';
import { MaterialEmail } from '@/components/form/controller/MaterialEmail';
import { MaterialFile } from '@/components/form/controller/MaterialFile';
import { MaterialCheckbox } from '@/components/form/controller/MaterialCheckbox';
import { MaterialNumber } from '@/components/form/controller/MaterialNumber';
import { MaterialPhone } from '@/components/form/controller/MaterialPhone';
import { MaterialIndianPhone } from '@/components/form/controller/MaterialIndianPhone';
import MaterialPassword from '@/components/form/controller/MaterialPassword';
import { MaterialTextArea } from '../controller/MaterialTextArea';
import { baseGeneralFieldStyle, baseStyle } from '../styles/materialStyles';
import { FileUpload } from '../controller/FileUpload';
import FileUploadWithView from '../controller/FileUploadWithView';
import { FileUploadWithButton } from '../controller/FileUploadWithButton';

export const getController = (field: any) => {
  const baseProps = {
    name: field.name,
    label: field.label,
    disabled: field.disabled,
    forcedValue: field.forcedValue,
    id: field.id,
  };

  const styledProps = {
    ...baseProps,
    baseStyle: baseStyle(field),
    className: baseGeneralFieldStyle,
  };

  switch (field.type) {
    case 'text':
      return (
        <MaterialText
          {...styledProps}
          uppercase={field.uppercase}
          disabled={field.disabled}
          forcedValue={field.forcedValue}
        />
      );
    case 'textarea':
      return (
        <MaterialTextArea
          {...baseProps}
          forcedValue={field.forcedValue}
          className="w-full"
          onInputChange={field.onInputChange}
        />
      );
    case 'email':
      return <MaterialEmail {...baseProps} {...styledProps} />;
    case 'number':
      return <MaterialNumber {...baseProps} {...styledProps} />;
    case 'phone':
      return <MaterialPhone {...baseProps} {...styledProps} />;
    case 'indian_phone':
      return <MaterialIndianPhone {...baseProps} {...styledProps} />;
    case 'file':
      return <MaterialFile {...baseProps} className={baseGeneralFieldStyle} />;
    case 'fileupload':
      return (
        <FileUpload
          {...baseProps}
          className={baseGeneralFieldStyle}
          maxFiles={field.maxFiles}
          description={field.description}
          helpText={field.helpText}
          accept={field.accept}
          multiple={field.maxFiles > 1}
        />
      );
    case 'fileupload_view':
      return (
        <FileUploadWithView
          {...baseProps}
          className={baseGeneralFieldStyle}
          maxFiles={field.maxFiles}
          description={field.description}
          helpText={field.helpText}
          accept={field.accept}
          multiple={field.maxFiles > 1}
        />
      );
    case 'fileupload_with_button':
      return (
        <FileUploadWithButton
          name={field.name}
          label={field.label}
          onUpload={field.onUpload}
          disabled={field.disabled}
        />
      );
    case 'checkbox':
      return (
        <MaterialCheckbox
          {...baseProps}
          options={field.options}
          handleCheckboxChange={field.handleCheckboxChange}
          isMulti={field.isMulti}
          defaultSelected={field.defaultSelected}
        />
      );
    case 'select':
      return <MaterialSelect {...baseProps} {...styledProps} options={field.options} placeholder={field.placeholder} />;
    case 'date':
      return <MaterialDatePicker {...baseProps} {...styledProps} error={field.error} />;
    case 'radio':
      return <MaterialRadioGroup {...baseProps} options={field.options} />;
    case 'password':
      return <MaterialPassword {...styledProps} />;
    default:
      return null;
  }
};
