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

export const getController = (field: any) => {
  const baseProps = {
    name: field.name,
    label: field.label,
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
          disabled={field.disabled}
          forcedValue={field.forcedValue}
          className="w-full"
          onInputChange={field.onInputChange}
        />
      );
    case 'email':
      return <MaterialEmail {...styledProps} />;
    case 'number':
      return <MaterialNumber {...styledProps} />;
    case 'phone':
      return <MaterialPhone {...styledProps} />;
    case 'indian_phone':
      return <MaterialIndianPhone {...styledProps} />;
    case 'file':
      return <MaterialFile {...baseProps} className={baseGeneralFieldStyle} />;
    case 'fileupload':
      return (
        <FileUpload
          {...baseProps}
          id={field.id}
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
          id={field.id}
          className={baseGeneralFieldStyle}
          maxFiles={field.maxFiles}
          description={field.description}
          helpText={field.helpText}
          accept={field.accept}
          multiple={field.maxFiles > 1}
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
      return <MaterialSelect {...styledProps} options={field.options} placeholder={field.placeholder} />;
    case 'date':
      return <MaterialDatePicker {...styledProps} error={field.error} />;
    case 'radio':
      return <MaterialRadioGroup {...baseProps} options={field.options} />;
    case 'password':
      return <MaterialPassword {...styledProps} />;
    default:
      return null;
  }
};
