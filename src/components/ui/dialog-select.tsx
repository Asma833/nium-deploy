import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Option {
  value: string;
  label: string;
  id?: string;
  typeId?: string;
}

interface DialogSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  options: Option[];
  required?: boolean;
  error?: string | undefined;
  disabled?: boolean;
  className?: string;
}

/**
 * DialogSelect - A reusable select component optimized for use inside dialogs
 *
 * Features:
 * - High z-index (9999) to appear above modal backdrops
 * - Integrated with react-hook-form
 * - TypeScript support
 * - Accessible labels and error messages
 *
 * @example
 * <DialogSelect
 *   name="fieldName"
 *   control={control}
 *   label="Select Option"
 *   placeholder="Choose an option"
 *   options={[{ value: "1", label: "Option 1" }]}
 *   required={true}
 *   error={errors.fieldName?.message}
 * />
 */
export function DialogSelect<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Select an option',
  options = [],
  required = false,
  error,
  disabled = false,
  className = '',
}: DialogSelectProps<T>) {
  return (
    <div className={`w-full ${className}`}>
      <Label htmlFor={name} className="block text-sm font-medium mb-2">
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {options?.map((option) => (
                <SelectItem key={option.id || option.typeId || option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
