import { Controller, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { ErrorMessage } from '../ErrorMessage';
import { Circle, CircleCheck } from 'lucide-react';

type MaterialRadioGroupProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: { [key: string]: { label: string; checked?: boolean } };
  disabled?: boolean;
  forcedValue?: string;
};

export const MaterialRadioGroup = <T extends FieldValues>({
  name,
  disabled = false,
  label,
  options,
  forcedValue,
}: MaterialRadioGroupProps<T>) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" className="!text-foreground">
        {label}
      </FormLabel>
      <Controller
        name={name}
        render={({ field }) => {
          return (
            <RadioGroup
              {...field}
              onChange={(e) => {
                const value = e.target.value;
                // Convert string to boolean for boolean fields
                if (value === 'true' || value === 'false') {
                  field.onChange(value === 'true');
                } else {
                  field.onChange(value);
                }
              }}
            >
              {Object.entries(options).map(([value, option]) => {
                // For boolean comparison, convert field.value to string
                const fieldValueAsString = typeof field.value === 'boolean' ? field.value.toString() : field.value;
                return (
                  <FormControlLabel
                    key={value}
                    value={(forcedValue ? forcedValue : value) || ''}
                    control={
                      <Radio
                        icon={<Circle size={'20'} className="text-foreground" />}
                        checked={fieldValueAsString === value}
                        checkedIcon={<CircleCheck className="text-primary" size={'20'} />}
                        disabled={disabled}
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
