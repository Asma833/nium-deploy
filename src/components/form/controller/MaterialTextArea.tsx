import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import { cn } from "@/utils/cn";

interface MaterialTextAreaProps {
  name: string;
  label: string;
  baseStyle?: any;
  className?: string;
  rows?: number;
  maxRows?: number;
  minRows?: number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error? : any;
  forcedValue?: string;
}

export const MaterialTextArea = ({
  name,
  label,
  baseStyle,
  className,
  rows = 4,
  maxRows,
  minRows,
  placeholder,
  disabled = false,
  required,
  forcedValue,
  error
}: MaterialTextAreaProps) => {
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
            value={(forcedValue ? forcedValue : field.value) || ""}
            label={label}
            error={!!error}
            helperText={error?.message}
            disabled={disabled}
            multiline
            required={required}
            rows={rows}
            {...(maxRows !== undefined && { maxRows })}
            {...(minRows !== undefined && { minRows })}
            {...(placeholder !== undefined && { placeholder })}
            {...(baseStyle && { sx: baseStyle })}
            className={cn(className)}
          />
        )}
      />
    </>
  );
};
