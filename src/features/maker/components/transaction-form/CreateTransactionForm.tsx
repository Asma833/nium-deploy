import { Fragment } from 'react';
import { Check } from 'lucide-react';
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
import { transactionFormDefaults } from './transaction-form.defaults';
import useGetTransactionType from '@/hooks/useGetTransactionType';
import useGetPurposes from '@/hooks/useGetPurposes';
import { CreateTransactionFormProps } from './transaction-form.types';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/common/DialogWrapper';
import RejectionSummary from '@/components/common/RejectionSummary';
import FromSectionTitle from '@/components/common/FromSectionTitle';

const fieldWrapperBaseStyle = 'mb-2';

const CreateTransactionForm = ({ mode }: CreateTransactionFormProps) => {
  const { transactionTypes } = useGetTransactionType();
  const { purposeTypes } = useGetPurposes();
  const formatedTransactionTypes = transactionTypes.map((type) => ({
    id: parseInt(type.id) || 0,
    label: type.text,
    value: type.text,
  }));
  const formatedPurposeTypes = purposeTypes.map((type) => ({
    id: parseInt(type.id) || 0,
    label: type.text,
    value: type.text,
  }));

  // Generate dynamic form config
  const formControllerMeta = getFormControllerMeta({
    transactionTypes: formatedTransactionTypes,
    purposeTypes: formatedPurposeTypes,
  });
  const methods = useForm({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transactionFormDefaults,
    mode: 'onChange',
  });

  const {
    control,
    getValues,
    reset,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;

  // Watch for form changes to debug
  const watchedValues = watch();

  const handleFormSubmit = () => {
    const formData = watchedValues;
    const manualFormData = getValues();

    console.log('Watched Values:', formData);
    console.log('GetValues Result:', manualFormData);
  };

  return (
    <Fragment>
      <FormProvider methods={methods}>
        <FormContentWrapper className="w-full bg-transparent">
          <Spacer>
            <FormFieldRow className={fieldWrapperBaseStyle} rowCols={4}>
              {Object.entries(formControllerMeta.fields.applicantDetails).map(([key, field]) => {
                return (
                  <FieldWrapper key={key}>
                    {getController({
                      ...field,
                      control,
                      errors,
                    })}
                  </FieldWrapper>
                );
              })}
            </FormFieldRow>
            <FromSectionTitle>Upload Document</FromSectionTitle>
            <FormFieldRow className={fieldWrapperBaseStyle} wrapperClassName="justify-between" rowCols={2}>
              <FieldWrapper className="w-full" error={errors?.uploadDocuments?.pan?.message || null}>
                {getController({
                  id: formControllerMeta.fields.uploadDocuments.pan.id,
                  label: formControllerMeta.fields.uploadDocuments.pan.label,
                  name: formControllerMeta.fields.uploadDocuments.pan.name,
                  type: formControllerMeta.fields.uploadDocuments.pan.type,
                  control,
                  errors,
                })}
              </FieldWrapper>
              <FieldWrapper
                className={fieldWrapperBaseStyle}
                error={errors?.uploadDocuments?.otherDocuments?.message || null}
              >
                {getController({
                  id: formControllerMeta.fields.uploadDocuments.otherDocuments.id,
                  label: formControllerMeta.fields.uploadDocuments.otherDocuments.label,
                  name: formControllerMeta.fields.uploadDocuments.otherDocuments.name,
                  type: formControllerMeta.fields.uploadDocuments.otherDocuments.type,
                  control,
                  errors,
                })}
              </FieldWrapper>
              <FieldWrapper
                className={fieldWrapperBaseStyle}
                flexdirection="row"
                label="Passport/Aadhar/Driving License/Voter ID"
              >
                <FieldWrapper error={errors?.uploadDocuments?.passportAadharDrivingVoter?.front?.message || null}>
                  {getController({
                    id: formControllerMeta.fields.uploadDocuments.passportAadharDrivingVoter.front.id,
                    label: formControllerMeta.fields.uploadDocuments.passportAadharDrivingVoter.front.label,
                    name: formControllerMeta.fields.uploadDocuments.passportAadharDrivingVoter.front.name,
                    type: formControllerMeta.fields.uploadDocuments.passportAadharDrivingVoter.front.type,
                    control,
                    errors,
                  })}
                </FieldWrapper>
                <FieldWrapper error={errors?.uploadDocuments?.passportAadharDrivingVoter?.back?.message || null}>
                  {getController({
                    id: formControllerMeta.fields.uploadDocuments.passportAadharDrivingVoter.back.id,
                    label: formControllerMeta.fields.uploadDocuments.passportAadharDrivingVoter.back.label,
                    name: formControllerMeta.fields.uploadDocuments.passportAadharDrivingVoter.back.name,
                    type: formControllerMeta.fields.uploadDocuments.passportAadharDrivingVoter.back.type,
                    control,
                    errors,
                  })}
                </FieldWrapper>
              </FieldWrapper>
              <FieldWrapper className="md:mt-[28px] w-full" error={errors?.uploadDocuments?.payerPan?.message || null}>
                {getController({
                  id: formControllerMeta.fields.uploadDocuments.payerPan.id,
                  label: formControllerMeta.fields.uploadDocuments.payerPan.label,
                  name: formControllerMeta.fields.uploadDocuments.payerPan.name,
                  type: formControllerMeta.fields.uploadDocuments.payerPan.type,
                  control,
                  errors,
                })}
              </FieldWrapper>
              <FieldWrapper className={fieldWrapperBaseStyle} flexdirection="row" label="Valid Student Passport">
                <FieldWrapper error={errors?.uploadDocuments?.studentPassport?.front?.message || null}>
                  {getController({
                    id: formControllerMeta.fields.uploadDocuments.studentPassport.front.id,
                    label: formControllerMeta.fields.uploadDocuments.studentPassport.front.label,
                    name: formControllerMeta.fields.uploadDocuments.studentPassport.front.name,
                    type: formControllerMeta.fields.uploadDocuments.studentPassport.front.type,
                    control,
                    errors,
                  })}
                </FieldWrapper>
                <FieldWrapper error={errors?.uploadDocuments?.studentPassport?.back?.message || null}>
                  {getController({
                    id: formControllerMeta.fields.uploadDocuments.studentPassport.back.id,
                    label: formControllerMeta.fields.uploadDocuments.studentPassport.back.label,
                    name: formControllerMeta.fields.uploadDocuments.studentPassport.back.name,
                    type: formControllerMeta.fields.uploadDocuments.studentPassport.back.type,
                    control,
                    errors,
                  })}
                </FieldWrapper>
              </FieldWrapper>
              <FieldWrapper
                className="md:mt-[28px] w-full"
                error={errors?.uploadDocuments?.payerRelationshipProof?.message || null}
              >
                {getController({
                  id: formControllerMeta.fields.uploadDocuments.payerRelationshipProof.id,
                  label: formControllerMeta.fields.uploadDocuments.payerRelationshipProof.label,
                  name: formControllerMeta.fields.uploadDocuments.payerRelationshipProof.name,
                  type: formControllerMeta.fields.uploadDocuments.payerRelationshipProof.type,
                  control,
                  errors,
                })}
              </FieldWrapper>
              <FieldWrapper
                className={fieldWrapperBaseStyle}
                error={errors?.uploadDocuments?.studentUniversityOfferLetter?.message || null}
              >
                {getController({
                  id: formControllerMeta.fields.uploadDocuments.studentUniversityOfferLetter.id,
                  label: formControllerMeta.fields.uploadDocuments.studentUniversityOfferLetter.label,
                  name: formControllerMeta.fields.uploadDocuments.studentUniversityOfferLetter.name,
                  type: formControllerMeta.fields.uploadDocuments.studentUniversityOfferLetter.type,
                  control,
                  errors,
                })}
              </FieldWrapper>
              <FieldWrapper
                className={fieldWrapperBaseStyle}
                error={errors?.uploadDocuments?.educationLoanDocument?.message || null}
              >
                {getController({
                  id: formControllerMeta.fields.uploadDocuments.educationLoanDocument.id,
                  label: formControllerMeta.fields.uploadDocuments.educationLoanDocument.label,
                  name: formControllerMeta.fields.uploadDocuments.educationLoanDocument.name,
                  type: formControllerMeta.fields.uploadDocuments.educationLoanDocument.type,
                  control,
                  errors,
                })}
              </FieldWrapper>
              <FieldWrapper
                className={fieldWrapperBaseStyle}
                error={errors?.uploadDocuments?.studentVisa?.message || null}
              >
                {getController({
                  id: formControllerMeta.fields.uploadDocuments.studentVisa.id,
                  label: formControllerMeta.fields.uploadDocuments.studentVisa.label,
                  name: formControllerMeta.fields.uploadDocuments.studentVisa.name,
                  type: formControllerMeta.fields.uploadDocuments.studentVisa.type,
                  control,
                  errors,
                })}
              </FieldWrapper>
            </FormFieldRow>
          </Spacer>
        </FormContentWrapper>
        <Button className="min-w-60" onClick={handleFormSubmit}>
          Submit
        </Button>
      </FormProvider>

      <FromSectionTitle>Rejection Summary</FromSectionTitle>
      <RejectionSummary className="mb-4" rejectionComments={[]} />

      <DialogWrapper
        isOpen={false}
        setIsOpen={() => {}}
        renderContent={
          <div className="flex justify-center items-center gap-4 text-2xl min-h-[200px] text-gray-500">
            <Check className="text-primary font-extrabold w-12 h-12 border rounded-full p-1" />
            <span>
              Transaction ID <b>NIUM123</b> Created.
            </span>
          </div>
        }
        showFooter={false}
        showHeader={false}
        isLoading={isSubmitting}
        iconType="default"
        triggerBtnClassName="bg-custom-primary text-white hover:bg-custom-primary-hover"
        className="sm:max-w-[80%] md:max-w-[50%] w-full max-h-[90%] overflow-auto"
        onSave={handleSubmit((data) => {
          reset(transactionFormDefaults);
        })}
        footerBtnText="Submit"
      />
    </Fragment>
  );
};

export default CreateTransactionForm;
