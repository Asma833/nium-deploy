import { Controller, useFormContext } from "react-hook-form";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ErrorMessage } from "../error-message";
import { cn } from "@/utils/cn";

interface MaterialSelectProps {
  name: string;
  label: string;
  options:
    | { [key: string]: { label: string } }
    | Array<{ value: string; label: string }>;
  baseStyle?: any;
  className?: string;
}

export const MaterialSelect = ({
  name,
  label,
  options,
  baseStyle,
  className,
}: MaterialSelectProps) => {
  const { control } = useFormContext();
  const isArrayOptions = Array.isArray(options);

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { value, ...field }, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error}>
            <InputLabel>{label}</InputLabel>
            <Select
              {...field}
              value={value || ""}
              label={label}
              sx={baseStyle}
              className={cn(className)}
            >
              {isArrayOptions
                ? (options as Array<{ value: string; label: string }>).map(
                    (option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    )
                  )
                : Object.entries(options).map(([value, { label }]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        )}
      />
      <ErrorMessage name={name} />
    </>
  );
};
