import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

interface MaterialPhoneProps {
  name: string;
  label: string;
  baseStyle?: any;
  className?: string;
  disabled?: boolean;
  forcedValue?: string;
}

export const MaterialPhone = ({ name, label, disabled = false, baseStyle, className }: MaterialPhoneProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          value={value ?? ''}
          onChange={(e) => {
            // Remove all non-numeric characters
            const numericValue = e.target.value.replace(/\D/g, '');
            // Limit to 10 digits
            const limitedValue = numericValue.slice(0, 10);
            onChange(limitedValue);
          }}
          disabled={disabled}
          type="tel"
          label={label}
          error={!!error}
          helperText={error?.message}
          sx={baseStyle}
          className={className ?? ''}
          placeholder="Enter phone number"
          inputProps={{
            maxLength: 10, // Limit to 10 digits
          }}
        />
      )}
    />
  );
};
