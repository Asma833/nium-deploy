import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import { basicDetails } from '../config/agent-profile-form-config';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import { getController } from '@/components/form/utils/getController';
import Spacer from '@/components/form/wrapper/Spacer';
import CheckboxWrapper from '@/components/form/wrapper/CheckboxWrapper';
import { useAgentForm } from '../../../context/agent-form-context';

export const BasicDetailsStep: React.FC = () => {
  const { updateFormData } = useAgentForm();
  const {
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const subscription = watch((formValues) => {
      if (!formValues) return;

      // Get the nested basicDetails object directly
      const basicDetailsData = formValues.basicDetails;
      if (basicDetailsData) {
        updateFormData('basicDetails', basicDetailsData);
      }
    });

    // Initial update
    const initialValues = getValues();
    if (initialValues.basicDetails) {
      updateFormData('basicDetails', initialValues.basicDetails);
    }

    return () => subscription.unsubscribe();
  }, [watch, updateFormData, getValues]);

  return (
    <FormContentWrapper>
      <form>
        <Spacer>
          <FormFieldRow rowCols={5}>
            {Object.values(basicDetails)
              .slice(0, 8)
              .map((field, index) => (
                <FieldWrapper key={index}>
                  {getController({
                    ...field,
                    error: errors[field.name]?.message,
                  })}
                </FieldWrapper>
              ))}
          </FormFieldRow>
          <FormFieldRow rowCols={4}>
            {Object.values(basicDetails)
              .slice(8)
              .map((field, index) => (
                <CheckboxWrapper
                  key={index}
                  className="items-direction-row"
                  error={errors[field.name]?.message as string}
                >
                  {getController({
                    ...field,
                    error: errors[field.name]?.message,
                  })}
                </CheckboxWrapper>
              ))}
          </FormFieldRow>
        </Spacer>
      </form>
    </FormContentWrapper>
  );
};
