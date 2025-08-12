import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useMemo } from 'react';
import { cn } from '@/utils/cn';
import { toTitleCase } from '@/utils/textFormater';
import { ErrorMessage } from '../ErrorMessage';
import '../styles/form-layout.css';

interface MaterialSelectProps {
  name: string;
  label: string;
  options:
    | { [key: string]: { label: string; selected?: boolean } }
    | Array<{ value: string; label: string; selected?: boolean; typeId?: string }>;
  baseStyle?: any;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  forcedValue?: string;
  required?: boolean;
}

export const MaterialSelect = ({
  name,
  label,
  disabled = false,
  required = false,
  options,
  forcedValue,
  baseStyle,
  className,
  placeholder,
}: MaterialSelectProps) => {
  const { control } = useFormContext();
  const isArrayOptions = Array.isArray(options);

  // Generate stable, unique keys for array options to avoid duplicate key warnings.
  // Strategy: use provided id or value as base. If duplicates occur, append an incrementing suffix.
  const processedArrayOptions = useMemo(() => {
    if (!isArrayOptions) return [];
    const counts: Record<string, number> = {};
    return (options as Array<{ id?: string; value: string; label: string; selected?: boolean; typeId?: string }>).map(
      (opt) => {
        const base = (opt.id ?? opt.value).toString();
        counts[base] = (counts[base] || 0) + 1;
        const key = counts[base] > 1 ? `${base}__${counts[base]}` : base;
        return { ...opt, _key: key } as typeof opt & { _key: string };
      }
    );
  }, [options, isArrayOptions]);

  // Get default value from options based on 'selected' property
  const getDefaultValue = () => {
    if (isArrayOptions) {
      const selectedOption = (options as Array<{ value: string; label: string; selected?: boolean }>).find(
        (option) => option.selected
      );
      return selectedOption ? selectedOption.value : '';
    } else {
      const entries = Object.entries(options);
      const selectedEntry = entries.find(([_, { selected }]) => selected);
      return selectedEntry ? selectedEntry[0] : '';
    }
  };

  const defaultValue = getDefaultValue();

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
          return (
            <FormControl fullWidth error={!!error}>
              <InputLabel>
                {<span> {label} {required && <span>*</span>}</span>}
              </InputLabel>
              <Select
                {...field}
                value={(forcedValue ? forcedValue : value) || ''}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                label={label}
                sx={baseStyle}
                disabled={disabled}
                className={cn(className, 'w-full max-w-full')}
                renderValue={(selected) => {
                  if (!selected || selected === '') {
                    return <em>{placeholder}</em>;
                  }
                  return (
                    <span className="block truncate">
                      {Array.isArray(selected) ? toTitleCase(selected.join(', ')) : selected}
                    </span>
                  );
                }}
              >
                <MenuItem disabled value="">
                  <em>{placeholder}</em>
                </MenuItem>
                {isArrayOptions
                  ? processedArrayOptions.map((option) => (
                      <MenuItem key={option._key} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))
                  : Object.entries(options).map(([value, { label }]) => (
                      <MenuItem
                        key={value}
                        value={value}
                        className="!whitespace-nowrap !overflow-hidden !text-ellipsis max-w-full"
                      >
                        <span className="block truncate">{label}</span>
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          );
        }}
      />
      <ErrorMessage name={name} />
    </>
  );
};
