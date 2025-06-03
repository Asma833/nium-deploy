import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from '@/components/form/providers/FormProvider';
import { getController } from '@/components/form/utils/getController';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import { transactionFormSchema } from './transaction-form.schema';
import { getFormControllerMeta } from './transaction-form.config';
import useGetTransactionType from '@/hooks/useGetTransactionType';
import useGetPurposes from '@/hooks/useGetPurposes';
import { camelCase } from 'lodash';

const CreateTransactionForm = () => {
  const { transactionTypes } = useGetTransactionType();
  const { purposeTypes } = useGetPurposes();
  const formatedTransactionTypes = transactionTypes.map((type) => ({
    id: parseInt(type.id) || 0,
    label: type.text,
    value: camelCase(type.text),
  }));
  const formatedPurposeTypes = purposeTypes.map((type) => ({
    id: parseInt(type.id) || 0,
    label: type.text,
    value: camelCase(type.text),
  }));

  // Generate dynamic form config
  const formControllerMeta = getFormControllerMeta({
    transactionTypes: formatedTransactionTypes,
    purposeTypes: formatedPurposeTypes,
  });

  const methods = useForm({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    control,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;

  return (
    <>
      <FormProvider methods={methods}>
        <FormContentWrapper className="w-full bg-transparent">
          <Spacer>
            <FormFieldRow className="mb-4" rowCols={4}>
              {Object.entries(formControllerMeta.fields.applicantDetails).map(
                ([key, field]) => (
                  <FieldWrapper key={key}>
                    {getController({
                      ...field,
                      control,
                      errors,
                    })}
                  </FieldWrapper>
                )
              )}
            </FormFieldRow>
            <FormFieldRow className="mb-4" rowCols={2}>
              {Object.entries(formControllerMeta.fields.uploadDocuments).map(
                ([key, field]) => (
                  <FieldWrapper key={key}>
                    {getController({
                      ...field,
                      control,
                      errors,
                    })}
                  </FieldWrapper>
                )
              )}
            </FormFieldRow>
          </Spacer>
        </FormContentWrapper>
      </FormProvider>
    </>
  );
};

export default CreateTransactionForm;
