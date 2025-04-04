import { createContext, useContext } from 'react';

interface InitialFormValuesContext {
  initialFormValues: Record<string, any>;
  setInitialValues: (newValues: any) => void;
}

export const InitialFormValuesContext = createContext<
  InitialFormValuesContext | undefined
>(undefined);

export const useInitialFormValues = () => {
  const context = useContext(InitialFormValuesContext);
  if (context === undefined) {
    throw new Error('useInitialFormValues must be used within a FormValuesProvider');
  }
  return context;
};
