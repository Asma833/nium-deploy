import { Controller, FieldValues, Path } from "react-hook-form";
import {
  Select,
  SelectProps,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ErrorMessage } from "../error-message";
import { cn } from "@/utils/cn";

type MaterialSelectProps<T extends FieldValues> = Omit<
  SelectProps,
  "name" | "defaultValue"
> & {
  name: Path<T>;
  options: { [key: string]: { label: string } };
  baseStyle?: any;
  className?: string;
};

export const MaterialSelect = <T extends FieldValues>({
  name,
  options,
  label,
  baseStyle,
  className,
  ...props
}: MaterialSelectProps<T>) => {
  return (
    <>
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel
              id={`${name}-label`}
              className="bg-background"
              sx={{
                padding: "0 5px",
                transform: baseStyle["& .MuiInputLabel-root"].transform,
                "&.Mui-focused": {
                  transform:
                    baseStyle["& .MuiInputLabel-root.Mui-focused"].transform,
                },
                "&.MuiFormLabel-filled": {
                  transform:
                    baseStyle["& .MuiInputLabel-root.Mui-focused"].transform,
                },
                "&.MuiInputLabel-root": {
                  color: "hsl(var(--muted))",
                  "&.Mui-focused": {
                    color: "hsl(var(--primary))",
                  },
                },
              }}
            >
              {label}
            </InputLabel>
            <Select
              {...field}
              {...props}
              labelId={`${name}-label`}
              label={label}
              className={cn("bg-background", className)}
              sx={{
                ...baseStyle,
                "& .MuiSelect-select": {
                  color: "inherit",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              MenuProps={{
                PaperProps: {
                  className: "bg-background",
                  sx: {
                    backgroundColor: "hsl(var(--background))",
                    "& .MuiMenuItem-root": {
                      color: "hsl(var(--foreground))",
                      "&:hover, &.Mui-selected": {
                        backgroundColor: "hsl(var(--accent))",
                      },
                    },
                  },
                },
              }}
            >
              {Object.entries(options).map(([value, option]) => (
                <MenuItem key={value} value={value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <ErrorMessage<T> name={name} />
    </>
  );
};
