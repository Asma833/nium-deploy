import { Controller, FieldValues, Path } from "react-hook-form";
import { TextFieldProps } from "@mui/material";
import { ErrorMessage } from "../error-message";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

type MaterialDatePickerProps<T extends FieldValues> = Omit<
  TextFieldProps,
  "name" | "defaultValue"
> & {
  name: Path<T>;
  baseStyle?: any;
};

export const MaterialDatePicker = <T extends FieldValues>({
  name,
  label,
  baseStyle,
  ...props
}: MaterialDatePickerProps<T>) => {
  return (
    <>
      <Controller<T>
        name={name}
        render={({ field, fieldState }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              {...field}
              sx={baseStyle}
              label={label}
              slotProps={{
                textField: {
                  ...props,
                  error: !!fieldState.error,
                },
              }}
            />
          </LocalizationProvider>
        )}
      />
      <ErrorMessage<T> name={name} />
    </>
  );
};
