import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

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
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type="number"
          label={label}
          error={!!error}
          helperText={error?.message}
          sx={baseStyle}
          className={className ?? ''}
        />
      )}
    />
  );
};
