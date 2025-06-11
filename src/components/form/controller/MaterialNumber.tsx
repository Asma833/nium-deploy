import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

interface MaterialNumberProps {
  name: string;
  label: string;
  baseStyle?: any;
  className?: string;
}

export const MaterialNumber = ({ name, label, baseStyle, className }: MaterialNumberProps) => {
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
            const val = e.target.value;
            onChange(val === '' ? '' : val);
          }}
          type="number"
          label={label}
          error={!!error}
          helperText={error?.message}
          sx={baseStyle}
          className={className ?? ''}
          inputProps={{
            min: 0, // Add min value if needed
            step: 'any', // Allow decimal numbers if needed
          }}
        />
      )}
    />
  );
};
