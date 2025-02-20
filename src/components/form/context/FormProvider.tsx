import React from "react";
import { FormProvider as RHFFormProvider, UseFormReturn, FieldValues } from "react-hook-form";
import { FormContext } from "./form-context";

type FormProviderProps<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  children: React.ReactNode;
  readOnly?: boolean;
};

export const FormProvider = <T extends FieldValues>({
  methods,
  children,
  readOnly = false,
}: FormProviderProps<T>) => {
  return (
    <FormContext.Provider value={{ ...methods, readOnly }}>
      <RHFFormProvider {...methods}>{children}</RHFFormProvider>
    </FormContext.Provider>
  );
};
