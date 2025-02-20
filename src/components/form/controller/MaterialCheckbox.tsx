import { Controller, useFormContext } from "react-hook-form";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { ErrorMessage } from "../error-message";
import { Circle, CircleCheck } from "lucide-react";

interface MaterialCheckboxProps {
  name: string;
  label: string;
  options: string[];
}

export const MaterialCheckbox = ({ name, options }: MaterialCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { value = [], onChange } }) => (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={value.includes(option)}
                    icon={<Circle size={"20"} />}
                    checkedIcon={<CircleCheck className="text-primary" size={"20"}  />}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...value, option]
                        : value.filter((v: string) => v !== option);
                      onChange(newValue);
                    }}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        )}
      />
      <ErrorMessage name={name} />
    </>
  );
};
