import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { StepValidationSchema } from '../../../features/admin-portal/pages/user-management/agent-profile-creation/types/form.types';

export const useFormStep = (stepId: string, validationSchema?: StepValidationSchema) => {
  const { trigger, getValues, formState: { errors } } = useFormContext();

  const validateStep = useCallback(async () => {
    if (!validationSchema) return true;

    const isValid = await trigger();
    if (!isValid) {
      return false;
    }

    const stepData = getValues();
    try {
      validationSchema.parse(stepData);
      return true;
    } catch (error) {
      return false;
    }
  }, [stepId, validationSchema, trigger, getValues, errors]);

  return {
    validateStep,
    stepErrors: errors,
  };
};
