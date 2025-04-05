import {
  FormProvider as RHFFormProvider,
  UseFormReturn,
  FieldValues,
} from 'react-hook-form';
import { ReactNode } from 'react';

interface FormProviderProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  children: ReactNode;
}

export const FormProvider = <T extends FieldValues>({
  methods,
  children,
}: FormProviderProps<T>) => (
  <RHFFormProvider {...methods}>{children}</RHFFormProvider>
);
