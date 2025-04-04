import { createContext, useContext } from 'react';
import { StepperContextType } from '../stepper.types';

export const StepperContext = createContext<StepperContextType | undefined>(
  undefined
);

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within StepperProvider');
  }
  return context;
};
