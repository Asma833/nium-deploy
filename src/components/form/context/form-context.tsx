import { createContext, useContext } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

export type FormContext<T extends FieldValues> = UseFormReturn<T> & {
  readOnly?: boolean;
};

export const FormContext = createContext<FormContext<any> | null>(null);

export const useFormContext = <T extends FieldValues>() => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context as FormContext<T>;
};
