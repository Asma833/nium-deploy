import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { cn } from '@/utils/cn';
import '../styles/form-layout.css';

interface MaterialTextProps {
  name: string;
  label: string;
  baseStyle?: React.CSSProperties;
  inputProps?: any;
  className?: string;
  uppercase?: boolean;
  disabled?: boolean;
  required?: boolean;
  forcedValue?: string;
  error?: any;
  onInputChange?: (value: string) => void;
}

export const MaterialText = ({
  name,
  label,
  baseStyle,
  inputProps,
  className,
  uppercase,
  disabled = false,
  required = false,
  forcedValue,
  error,
  onInputChange,
}: MaterialTextProps) => {
  const { control } = useFormContext();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: string) => void
  ) => {
    const inputValue = uppercase ? e.target.value.toUpperCase() : e.target.value;
    onChange(inputValue);
    if (onInputChange) {
      onInputChange(inputValue);
    }
  };
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            value={(forcedValue ? forcedValue : field.value) || ''}
            label={label}
            error={!!error}
            helperText={error?.message}
            disabled={disabled}
            required={required}
            onChange={(e) => handleChange(e, field.onChange)}
            sx={baseStyle as SxProps<Theme>}
            className={cn(className)}
          />
        )}
      />
    </>
  );
};
