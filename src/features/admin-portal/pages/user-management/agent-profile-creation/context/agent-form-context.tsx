import { createContext, useContext } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

interface AgentFormContextType {
  formData: Record<string, any>;
  updateFormData: (step: string, data: Record<string, any>) => void;
  saveFormData: () => Promise<Record<string, any>>;
}

export type FormContext<T extends FieldValues> = UseFormReturn<T> & {
  readOnly?: boolean;
};

export const AgentFormContext = createContext<AgentFormContextType | undefined>(
  undefined
);

export const useAgentForm = () => {
  const context = useContext(AgentFormContext);
  if (!context) {
    throw new Error('useAgentForm must be used within AgentFormProvider');
  }
  return context;
};
