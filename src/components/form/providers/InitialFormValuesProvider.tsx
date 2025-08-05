import React, { ReactNode, useState, useCallback } from 'react';
import { InitialFormValuesContext } from '../context/initial-form-values-context';

interface InitialFormValuesProviderProps {
  children: ReactNode;
}

export type FormValues = Record<string, any>;

export const InitialFormValuesProvider: React.FC<InitialFormValuesProviderProps> = ({ children }) => {
  const [initialFormValues, setFormValues] = useState<FormValues>({});

  const setInitialValues = useCallback((newValues: FormValues) => {
    setFormValues((prev) => {
      const stringifiedPrev = JSON.stringify(prev);
      const stringifiedNew = JSON.stringify(newValues);

      if (stringifiedPrev === stringifiedNew) {
        return prev;
      }

      return newValues;
    });
  }, []);

  return (
    <InitialFormValuesContext.Provider
      value={{
        initialFormValues,
        setInitialValues,
      }}
    >
      {children}
    </InitialFormValuesContext.Provider>
  );
};
