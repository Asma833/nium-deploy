import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

interface MaterialEmailProps {
  name: string;
  label: string;
  baseStyle?: any;
  className?: string;
}

export const MaterialEmail = ({ name, label, baseStyle, className }: MaterialEmailProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type="email"
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
