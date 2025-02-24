import { Controller, useFormContext } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface MaterialDatePickerProps {
  name: string;
  label: string;
  baseStyle?: any;
  className?: string;
  error?: string;
}

export const MaterialDatePicker = ({
  name,
  label,
  baseStyle,
  className,
  error,
}: MaterialDatePickerProps) => {
  const { control, clearErrors } = useFormContext();

  const mergedStyles = {
    ...baseStyle,
    ...(error && {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "hsl(var(--destructive))",
        },
      },
    }),
  };

  return (
    <div className="flex flex-col w-full">
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <DatePicker
            {...field}
            label={label}
            value={field.value ? dayjs(field.value) : null}
            onChange={(date) => {
              field.onChange(date?.toISOString() || null);
              if (date) {
                clearErrors(name);
              }
            }}
            slotProps={{
              textField: {
                error: !!fieldState.error,
                helperText: fieldState.error?.message,
                sx: mergedStyles,
                ...(className && { className }),
              },
            }}
          />
        )}
      />
    </div>
  );
};
