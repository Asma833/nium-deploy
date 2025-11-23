import { Controller, useFormContext } from 'react-hook-form';
import { TextField, InputAdornment } from '@mui/material';
import { useState } from 'react';

interface MaterialPhoneProps {
  name: string;
  label: string;
  baseStyle?: any;
  className?: string;
  disabled?: boolean;
  forcedValue?: string;
  required?: boolean;
}

export const MaterialPhone = ({
  name,
  label,
  disabled = false,
  forcedValue,
  baseStyle,
  className,
  required = false,
}: MaterialPhoneProps) => {
  const { control } = useFormContext();
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const prefixColor = disabled ? "#666" : "#111";
  const prefixErrorColor = "#d32f2f";
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          value={(forcedValue ? forcedValue : value) || ''}
          onChange={(e) => {
            // Remove all non-numeric characters
            const numericValue = e.target.value.replace(/\D/g, '');
            // Limit to 10 digits
            const limitedValue = numericValue.slice(0, 10);
            onChange(limitedValue);
          }}
          onFocus={() => setHasBeenFocused(true)}
          disabled={disabled}
          type="tel"
          label={label}
          error={!!error}
          helperText={error?.message}
          sx={baseStyle}
          required={required}
          className={className ?? ''}
          placeholder="Enter phone number"
          InputProps={{
            startAdornment: (forcedValue ? forcedValue : value) ? (
               <InputAdornment
                  position="start"
                  sx={{
                    mr: 1, // small gap between adornment and input text
                    display: "flex",
                    alignItems: "center",
                    "& span": {
                      color: !!error ? prefixErrorColor : prefixColor,
                      WebkitTextFillColor: !!error ? prefixErrorColor : prefixColor,
                    },
                  }}
                >
                  {/* always render prefix so space is reserved */}
                  <span>+91</span>
                </InputAdornment>
            ) : null,
          }}
          inputProps={{
            maxLength: 10, // Limit to 10 digits
          }}
        />
      )}
    />
  );
};
