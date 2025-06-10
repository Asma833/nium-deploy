import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { formatIndianMobileNumber } from '@/utils/textFormater';

interface MaterialIndianPhoneProps {
  name: string;
  label: string;
  baseStyle?: any;
  className?: string;
}

export const MaterialIndianPhone = ({ name, label, baseStyle, className }: MaterialIndianPhoneProps) => {
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
            let numericValue = e.target.value.replace(/\D/g, '');

            // Handle different input scenarios
            if (numericValue.startsWith('91') && numericValue.length <= 12) {
              // If starts with 91 (country code), allow up to 12 digits
              numericValue = numericValue.slice(0, 12);
            } else if (numericValue.startsWith('91') && numericValue.length > 12) {
              // If more than 12 digits and starts with 91, trim to 12
              numericValue = numericValue.slice(0, 12);
            } else if (!numericValue.startsWith('91') && numericValue.length <= 10) {
              // If doesn't start with 91, allow up to 10 digits (will add +91 in formatting)
              numericValue = numericValue.slice(0, 10);
            } else if (!numericValue.startsWith('91') && numericValue.length > 10) {
              // If more than 10 digits and doesn't start with 91, trim to 10
              numericValue = numericValue.slice(0, 10);
            }

            // Format the phone number
            const formattedValue = formatIndianMobileNumber(numericValue);
            onChange(formattedValue);
          }}
          type="tel"
          label={label}
          error={!!error}
          helperText={error?.message}
          sx={baseStyle}
          className={className ?? ''}
          placeholder="+91 98765 43210"
          inputProps={{
            maxLength: 17, // Account for formatted phone number length (+91 XXXXX XXXXX)
          }}
        />
      )}
    />
  );
};
