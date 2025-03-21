import { Controller, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ErrorMessage } from "../error-message";
import { Circle, CircleCheck } from "lucide-react";

type MaterialRadioGroupProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: { [key: string]: { label: string; checked?: boolean } };
};

export const MaterialRadioGroup = <T extends FieldValues>({
  name,
  label,
  options,
}: MaterialRadioGroupProps<T>) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        render={({ field }) => {
          return (
            <RadioGroup {...field}>
              {Object.entries(options).map(([value, option]) => {
                return (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={
                      <Radio
                        icon={<Circle size={"20"} />}
                        checked={field.value === value }
                        checkedIcon={
                          <CircleCheck className="text-primary" size={"20"} />
                        }
                      />
                    }
                    label={option.label}
                  />
                );
              })}
            </RadioGroup>
          );
        }}
      />
      <ErrorMessage<T> name={name} />
    </FormControl>
  );
};
