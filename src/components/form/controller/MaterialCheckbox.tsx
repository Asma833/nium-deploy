import { Controller, useFormContext } from "react-hook-form";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { ErrorMessage } from "../error-message";
import { Circle, CircleCheck } from "lucide-react";

interface MaterialCheckboxProps {
  name: string;
  label: string;
  options: { [key: string]: { label: string; checked?: boolean } };
}

export const MaterialCheckbox = ({ name, options }: MaterialCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={Object.entries(options)
          .filter(([_, opt]) => opt.checked)
          .map(([key]) => key)}
        render={({ field: { value = [], onChange } }) => (
          <FormGroup>
            {Object.entries(options).map(([key, option]) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={value.includes(key)}
                    icon={<Circle size={"20"} />}
                    checkedIcon={<CircleCheck className="text-primary" size={"20"} />}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...value, key]
                        : value.filter((v: string) => v !== key);
                      onChange(newValue);
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
        )}
      />
      <ErrorMessage name={name} />
    </>
  );
};
