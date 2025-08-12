import { Controller, useFormContext } from 'react-hook-form';
import { FormGroup, FormControlLabel, Checkbox, Radio } from '@mui/material';
import { Circle, CircleCheck, Square, CheckSquare, CircleDot, Disc, SquareCheck } from 'lucide-react';
import { ErrorMessage } from '../ErrorMessage';
import { CustomRadioIcon, CustomSquareCheckIcon } from '@/components/common/CustomCheckboxIcons';

type CheckboxVariant = 'square_check' | 'circle_check' | 'radio_style' | 'circle_check_filled' | 'square_check_filled';
type CheckboxSize = 'small' | 'medium' | 'large';

interface MaterialCheckboxProps {
  name: string;
  label?: string;
  options: Record<string, { label: string }>;
  handleCheckboxChange?: (key: string, checked: boolean) => void;
  isMulti: boolean;
  defaultSelected?: Record<string, boolean>;
  error?: boolean | string;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  classNames?: {
    wrapper?: string;
    formGroup?: string;
  };
}

export const MaterialCheckbox = ({
  name,
  options,
  handleCheckboxChange,
  isMulti,
  defaultSelected = {},
  error,
  variant = 'circle_check',
  size = 'medium',
  classNames = {
    wrapper: '',
    formGroup: '',
  },
}: MaterialCheckboxProps) => {
  const { control, setValue, trigger, getValues } = useFormContext();

  // Ensure name is a valid string
  const fieldName = typeof name === 'string' && name ? name : 'defaultName';

  // Helper function to get icon size based on size prop
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  // Helper function to get icons based on variant
  const getIcons = (isChecked: boolean) => {
    const iconSize = getIconSize();

    switch (variant) {
      case 'square_check':
        return {
          unchecked: <Square size={iconSize} color="var(--fill-primary)" stroke="var(--fill-primary)" />,
          checked: <CheckSquare className="text-primary" size={iconSize} />,
        };
      case 'circle_check':
        return {
          unchecked: <Circle size={iconSize} />,
          checked: <CircleCheck className="text-primary" size={iconSize} />,
        };
      case 'circle_check_filled':
        return {
          unchecked: <Circle size={iconSize} />,
          checked: <Disc className="text-primary" size={iconSize} />,
        };
      case 'square_check_filled':
        return {
          unchecked: (
            <CustomSquareCheckIcon
              className="text-primary-foreground rounded-sm bg-primary"
              fill="var(--fill-foreground)"
              size={iconSize}
            />
          ),
          checked: (
            <CustomSquareCheckIcon
              className="text-primary-foreground rounded-sm bg-primary"
              fill="var(--fill-primary)"
              size={iconSize}
              selected
            />
          ),
        };
      case 'radio_style':
        return {
          unchecked: (
            <CustomRadioIcon
              size={iconSize}
              fill="white"
              color="var(--fill-primary)"
              className="text-primary-foreground rounded-sm"
            />
          ),
          checked: (
            <CustomRadioIcon
              selected
              fill="var(--fill-foreground)"
              className="text-primary-foreground rounded-sm"
              size={iconSize}
              color="var(--fill-primary)"
            />
          ),
        };
      default:
        return {
          unchecked: <Circle size={iconSize} />,
          checked: <CircleCheck className="text-primary" size={iconSize} />,
        };
    }
  };

  // Function to check if a path exists in the form values
  const getValueAtPath = (path: string) => {
    const formValues = getValues();
    const pathParts = path.split('.');
    let value = formValues;

    for (const part of pathParts) {
      if (value === undefined || value === null) return undefined;
      value = value[part];
    }

    return value;
  };

  const getDefaultValues = () => {
    // For nested fields, try to get the value from the parent
    if (isNestedField) {
      const parentValue = getValueAtPath(parentPath);
      if (
        parentValue &&
        typeof parentValue === 'object' &&
        parentValue[lastPart] &&
        typeof parentValue[lastPart] === 'object'
      ) {
        return parentValue[lastPart];
      }
    } else {
      // For non-nested fields, try to get the value directly
      const existingValues = getValueAtPath(fieldName);
      if (existingValues && typeof existingValues === 'object') {
        return existingValues;
      }
    }

    // Otherwise create default values
    if (isMulti) {
      return Object.fromEntries(Object.keys(options).map((key) => [key, false]));
    } else {
      return Object.fromEntries(Object.keys(options).map((key) => [key, defaultSelected?.[key] || false]));
    }
  };

  // Check if the field name contains dots (indicating a nested path)
  const isNestedField = fieldName.includes('.');

  // Parse the nested path to get the parent and child parts
  const getNestedParts = () => {
    const parts = fieldName.split('.');
    const lastPart = parts.pop() || '';
    const parentPath = parts.join('.');
    return { parentPath, lastPart };
  };

  // For nested fields, we need special handling
  const { parentPath, lastPart } = isNestedField ? getNestedParts() : { parentPath: '', lastPart: fieldName };

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={getDefaultValues()}
      render={({ field }) => (
        <div className={classNames.wrapper}>
          <FormGroup style={{ zoom: 0.9 }} className={classNames?.formGroup ?? ''}>
            {Object.entries(options).map(([key, option]) => {
              const isChecked = field.value?.[key] || false;
              const icons = getIcons(isChecked);

              // Use Radio component for radio_style variant, Checkbox for others
              const InputComponent = variant === 'radio_style' ? Radio : Checkbox;

              return (
                <FormControlLabel
                  key={key}
                  control={
                    <InputComponent
                      checked={isChecked}
                      icon={icons.unchecked}
                      checkedIcon={icons.checked}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let updatedValue = { ...field.value, [key]: checked };

                        // For radio_style or single selection, uncheck all others when a new one is selected
                        if (!isMulti || variant === 'radio_style') {
                          updatedValue = Object.fromEntries(
                            Object.keys(options).map((k) => [k, k === key ? checked : false])
                          );
                        }

                        // Update the form state
                        field.onChange(updatedValue);

                        // Use setValue with the proper path to ensure nested fields are updated correctly
                        if (isNestedField) {
                          // For nested fields, we need to get the current parent object and update just the part we want
                          const currentValues = getValues();
                          const parentObj = parentPath.split('.').reduce((obj, part) => {
                            if (!obj[part]) obj[part] = {};
                            return obj[part];
                          }, currentValues);

                          // Update the nested part
                          parentObj[lastPart] = updatedValue;

                          // Set the entire parent object
                          setValue(parentPath, parentObj, { shouldDirty: true, shouldTouch: true });
                        } else {
                          // For regular fields, just set the value directly
                          setValue(fieldName, updatedValue, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                        }

                        // Call handleCheckboxChange with the key and checked state if it exists
                        if (handleCheckboxChange) {
                          handleCheckboxChange(key, checked);
                        }

                        trigger(fieldName);
                      }}
                    />
                  }
                  label={option.label}
                />
              );
            })}
          </FormGroup>
          <ErrorMessage name={fieldName} />
        </div>
      )}
    />
  );
};
