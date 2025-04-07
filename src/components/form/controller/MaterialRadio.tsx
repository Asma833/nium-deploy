import { Controller, FieldValues, Path } from 'react-hook-form';
import { Radio, RadioProps, FormControl } from '@mui/material';
import { ErrorMessage } from '../ErrorMessage';

type MaterialRadioProps<T extends FieldValues> = Omit<
  RadioProps,
  'name' | 'defaultValue'
> & {
  name: Path<T>;
};

export const MaterialRadio = <T extends FieldValues>({
  name,
  ...props
}: MaterialRadioProps<T>) => {
  return (
    <>
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <FormControl error={!!fieldState.error}>
            <Radio {...field} {...props} />
          </FormControl>
        )}
      />
      <ErrorMessage<T> name={name} />
    </>
  );
};
