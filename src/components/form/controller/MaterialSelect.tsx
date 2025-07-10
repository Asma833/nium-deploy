import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { cn } from '@/utils/cn';
import { toTitleCase } from '@/utils/textFormater';
import { ErrorMessage } from '../ErrorMessage';
import '../styles/form-layout.css';

interface MaterialSelectProps {
  name: string;
  label: string;
  options:
    | { [key: string]: { label: string; selected?: boolean } }
    | Array<{ value: string; label: string; selected?: boolean }>;
  baseStyle?: any;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  forcedValue?: string;
}

export const MaterialSelect = ({
  name,
  label,
  disabled = false,
  options,
  forcedValue,
  baseStyle,
  className,
  placeholder,
}: MaterialSelectProps) => {
  const { control } = useFormContext();
  const isArrayOptions = Array.isArray(options);

  // Get default value from options based on 'selected' property
  const getDefaultValue = () => {
    if (isArrayOptions) {
      const selectedOption = (options as Array<{ value: string; label: string; selected?: boolean }>).find(
        (option) => option.selected
      );
      return selectedOption ? selectedOption.value : '';
    } else {
      const entries = Object.entries(options);
      const selectedEntry = entries.find(([_, { selected }]) => selected);
      return selectedEntry ? selectedEntry[0] : '';
    }
  };

  const defaultValue = getDefaultValue();

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
          return (
            <FormControl fullWidth error={!!error}>
              <InputLabel>{label}</InputLabel>
              <Select
                {...field}
                value={(forcedValue ? forcedValue : value) || ''}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                label={label}
                sx={baseStyle}
                disabled={disabled}
                className={cn(className)}
                renderValue={(selected) => {
                  if (!selected || selected === '') {
                    return <em>{placeholder}</em>;
                  }
                  return Array.isArray(selected) ? toTitleCase(selected.join(', ')) : selected;
                }}
              >
                <MenuItem disabled value="">
                  <em>{placeholder}</em>
                </MenuItem>
                {isArrayOptions
                  ? (
                      options as Array<{
                        value: string;
                        label: string;
                        selected?: boolean;
                      }>
                    ).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))
                  : Object.entries(options).map(([value, { label }]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          );
        }}
      />
      <ErrorMessage name={name} />
    </>
  );
};
