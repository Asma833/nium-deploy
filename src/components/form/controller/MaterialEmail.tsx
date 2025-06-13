import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

interface MaterialEmailProps {
  name: string;
  label: string;
  baseStyle?: any;
  className?: string;
  disabled?: boolean;
  forcedValue?: string;
}

export const MaterialEmail = ({
  name,
  label,
  disabled = false,
  forcedValue,
  baseStyle,
  className,
}: MaterialEmailProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          disabled={disabled}
          value={(forcedValue ? forcedValue : value) || ''}
          onChange={(e) => {
            onChange(e.target.value || ''); // Handle empty string case
          }}
          type="email"
          label={label}
          error={!!error}
          helperText={error?.message}
          sx={baseStyle}
          className={className ?? ''}
          placeholder="Enter Email Address"
        />
      )}
    />
  );
};
