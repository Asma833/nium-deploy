import { Controller, FieldValues, Path } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";
import { ErrorMessage } from "../error-message";
import { cn } from "@/utils/cn";

type MaterialTextProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "name" | "defaultValue" | "className"
> & {
  name: Path<T>;
  uppercase?: boolean;
  height?: string | number;
  baseStyle?: any;
  className?: string;
};

export const MaterialText = <T extends FieldValues>({
  name,
  label,
  uppercase,
  className,
  baseStyle,
  ...props
}: MaterialTextProps<T>) => {
  return (
    <>
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            {...props}
            sx={baseStyle}
            label={label}
            className={cn(className)}
            error={!!fieldState.error}
            helperText={fieldState.error ? fieldState.error.message : null}
            onChange={(e) => {
              const value = uppercase
                ? e.target.value.toUpperCase()
                : e.target.value;
              field.onChange(value);
            }}
          />
        )}
      />
      <ErrorMessage<T> name={name} />
    </>
  );
};
