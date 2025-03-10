import { Controller, useFormContext } from "react-hook-form";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { Circle, CircleCheck } from "lucide-react";
import { ErrorMessage } from "../error-message";
interface MaterialCheckboxProps {
  name: string; 
  label: string; 
  options: Record<string, { label: string }>; 
  handleCheckboxChange: (key: string, checked: boolean) => void; // Callback function when checkbox state changes
  isMulti: boolean; // Flag to determine if multiple selections are allowed
  defaultSelected:{}
}

export const MaterialCheckbox = ({ name, options, handleCheckboxChange, isMulti,defaultSelected }: MaterialCheckboxProps) => {
  const { control, setValue, trigger } = useFormContext();
  const getDefaultValues = () => {
    if (isMulti) {
      return Object.fromEntries(Object.keys(options).map((key) => [key, false])); // All unchecked
    } else {
      return Object.fromEntries(Object.keys(options).map((key) => [key, (defaultSelected as Record<string, boolean>)[key] || false])); // Only one true
    }
  };
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={getDefaultValues()} // Set default value dynamically
      render={({ field }) => (
        <div>
          <FormGroup style={{ zoom: 0.8 }}>
            {Object.entries(options).map(([key, option]) => {
              const isChecked = field.value?.[key] || false;

              return (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={isChecked}
                      icon={<Circle size={20} />}
                      checkedIcon={<CircleCheck className="text-primary" size={20} />}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        let updatedValue = { ...field.value, [key]: checked };

                        // If single selection, uncheck all others when a new one is selected
                        if (!isMulti) {
                          updatedValue = Object.fromEntries(
                            Object.keys(options).map((k) => [k, k === key ? checked : false])
                          );
                        }

                        // Update the form state
                        field.onChange(updatedValue);
                        setValue(name, updatedValue);
                        handleCheckboxChange(key, checked);
                        trigger(name);
                      }}
                    />
                  }
                  label={option.label}
                />
              );
            })}
          </FormGroup>
            <ErrorMessage name={name} />
        </div>
      )}
    />
  );
};
