import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { SxProps, Theme } from '@mui/system';
import { cn } from '@/utils/cn';

interface MaterialTextProps {
  name: string;
  label: string;
  baseStyle?: React.CSSProperties;
  className?: string;
  uppercase?: boolean;
  disabled?: boolean;
  required?: boolean;
  forcedValue?: string;
  error?: any;
}

export const MaterialText = ({
  name,
  label,
  baseStyle,
  className,
  uppercase,
  disabled = false,
  required = false,
  forcedValue,
  error,
}: MaterialTextProps) => {
  const { control } = useFormContext();

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
            onChange={(e) => {
              const value = uppercase
                ? e.target.value.toUpperCase()
                : e.target.value;
              field.onChange(value);
            }}
            sx={baseStyle as SxProps<Theme>}
            className={cn(className)}
          />
        )}
      />
    </>
  );
};
