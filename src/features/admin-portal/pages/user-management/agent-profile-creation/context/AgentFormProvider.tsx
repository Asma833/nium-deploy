import React, { useState } from 'react';
import { AgentFormContext } from './agent-form-context';

export const AgentFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const updateFormData = React.useCallback(
    (step: string, data: Record<string, any>) => {
      setFormData((prevData) => {
        const newData = {
          ...prevData,
          [step]: data,
        };
        return newData;
      });
    },
    []
  );

  const saveFormData = async () => {
    try {
      return Promise.resolve(formData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AgentFormContext.Provider
      value={{ formData, updateFormData, saveFormData }}
    >
      {children}
    </AgentFormContext.Provider>
  );
};
