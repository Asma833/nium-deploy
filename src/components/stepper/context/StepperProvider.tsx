import React, { useReducer, useCallback } from 'react';
import { stepperReducer, initialState } from '../reducers/stepperReducer';
import { StepperContext } from './stepper-context';
import { StepperProviderProps } from '../stepper.types';

export const StepperProvider: React.FC<StepperProviderProps> = ({
  children,
  steps,
  onComplete,
}) => {
  const [state, dispatch] = useReducer(stepperReducer, initialState);

  const goToNextStep = useCallback(async () => {
    if (state.currentStep === steps.length - 1) {
      dispatch({ type: 'SET_SUBMITTING', payload: true });
      try {
        await onComplete(state.data);
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: { submit: 'Form submission failed' },
        });
      } finally {
        dispatch({ type: 'SET_SUBMITTING', payload: false });
      }
      return;
    }

    dispatch({ type: 'NEXT_STEP' });
  }, [state.currentStep, state.data, steps.length, onComplete]);

  const goToPrevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const setStepValid = useCallback((stepId: string, isValid: boolean) => {
    dispatch({
      type: 'SET_STEP_VALID',
      payload: { stepId, isValid },
    });
  }, []);

  return (
    <StepperContext.Provider
      value={{ state, goToNextStep, goToPrevStep, setStepValid }}
    >
      {children}
    </StepperContext.Provider>
  );
};

export default StepperProvider;
