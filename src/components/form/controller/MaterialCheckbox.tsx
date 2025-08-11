import { Controller, useFormContext } from 'react-hook-form';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Circle, CircleCheck } from 'lucide-react';
import { ErrorMessage } from '../ErrorMessage';
interface MaterialCheckboxProps {
  name: string;
  label?: string;
  options: Record<string, { label: string }>;
  handleCheckboxChange: (key: string, checked: boolean) => void;
  isMulti: boolean;
  defaultSelected?: Record<string, boolean>;
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
  classNames={
    wrapper:'',
    formGroup:''
  }
}: MaterialCheckboxProps) => {
  const { control, setValue, trigger } = useFormContext();

  // Ensure name is a valid string
  const fieldName = typeof name === 'string' && name ? name : 'defaultName';

  const getDefaultValues = () => {
    if (isMulti) {
      return Object.fromEntries(Object.keys(options).map((key) => [key, false]));
    } else {
      return Object.fromEntries(Object.keys(options).map((key) => [key, defaultSelected?.[key] || false]));
    }
  };

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

              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={isChecked}
                      icon={<Circle size={20} />}
                      checkedIcon={<CircleCheck className="text-primary" size={20} />}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let updatedValue = { ...field.value, [key]: checked };

                        // If single selection, uncheck all others when a new one is selected
                        if (!isMulti) {
                          updatedValue = Object.fromEntries(
                            Object.keys(options).map((k) => [k, k === key ? checked : false])
                          );
                        }

                        // Update the form state
                        field.onChange(updatedValue);
                        setValue(fieldName, updatedValue);

                        // Call handleCheckboxChange with the key and checked state
                        handleCheckboxChange(key, checked);

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
