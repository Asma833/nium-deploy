import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
// import { ErrorMessage } from "../error-message";
import { cn } from "@/utils/cn";

interface MaterialTextProps {
  name: string;
  label: string;
  baseStyle?: any;
  className?: string;
  uppercase?: boolean;
}

export const MaterialText = ({
  name,
  label,
  baseStyle,
  className,
  uppercase,
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
            value={field.value || ""}
            label={label}
            error={!!error}
            helperText={error?.message}
            onChange={(e) => {
              const value = uppercase
                ? e.target.value.toUpperCase()
                : e.target.value;
              field.onChange(value);
            }}
            sx={baseStyle}
            className={cn(className)}
          />
        )}
      />
    </>
  );
};
