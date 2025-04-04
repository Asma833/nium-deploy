import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import { agreementDetails } from '../config/agent-profile-form-config';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import { getController } from '@/components/form/utils/getController';
import Spacer from '@/components/form/wrapper/Spacer';
import CheckboxWrapper from '@/components/form/wrapper/CheckboxWrapper';
import { useAgentForm } from '../../../context/agent-form-context';

export const AgrementDetailsStep: React.FC = () => {
  const { updateFormData } = useAgentForm();
  const {
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const subscription = watch((formValues) => {
      if (!formValues) return;

      const agreementDetails = {
        adminDetails: formValues.agreementDetails.adminDetails,
        bankDetails: formValues.agreementDetails.bankDetails,
      };
      if (agreementDetails) {
        updateFormData('agreementDetails', agreementDetails);
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
          <FormFieldRow rowCols={5} groupName="Admin Details">
            {Object.values(agreementDetails.adminDetails)
              .slice(0, 3)
              .map((field, index) => (
                <FieldWrapper
                  key={index}
                  error={errors[field.name]?.message as string}
                >
                  {getController({
                    ...field,
                    error: errors[field.name]?.message,
                  })}
                </FieldWrapper>
              ))}
          </FormFieldRow>
          <FormFieldRow rowCols={1}>
            {Object.values(agreementDetails.adminDetails)
              .slice(3)
              .map((field, index) => (
                <FieldWrapper
                  key={index}
                  error={errors[field.name]?.message as string}
                >
                  <CheckboxWrapper>
                    {getController({
                      ...field,
                      error: errors[field.name]?.message,
                    })}
                  </CheckboxWrapper>
                </FieldWrapper>
              ))}
          </FormFieldRow>
          <FormFieldRow rowCols={4} groupName="Bank Details">
            {Object.values(agreementDetails.bankDetails).map((field, index) => (
              <FieldWrapper
                key={index}
                error={errors[field.name]?.message as string}
              >
                <CheckboxWrapper key={index} className="items-direction-row">
                  {getController(field)}
                </CheckboxWrapper>
              </FieldWrapper>
            ))}
          </FormFieldRow>
        </Spacer>
      </form>
    </FormContentWrapper>
  );
};
