import { Fragment, useState } from 'react';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from '@/components/form/providers/FormProvider';
import { getController } from '@/components/form/utils/getController';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import { transactionFormSchema, TransactionFormData } from './transaction-form.schema';
import { getFormControllerMeta } from './transaction-form.config';
import { transactionFormDefaults } from './transaction-form.defaults';
import useGetTransactionType from '@/hooks/useGetTransactionType';
import useGetPurposes from '@/hooks/useGetPurposes';
import { CreateTransactionFormProps } from './transaction-form.types';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/common/DialogWrapper';
import RejectionSummary from '@/components/common/RejectionSummary';
import FromSectionTitle from '@/components/common/FromSectionTitle';
import { UploadDocuments } from '@/components/common/UploadDocuments';
import { useCreateTransaction } from '../../hooks/useCreateTransaction';
import { transformFormDataToApiRequest } from '../../utils/transformFormData';

const fieldWrapperBaseStyle = 'mb-2';

const CreateTransactionForm = ({ mode }: CreateTransactionFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createdTransactionId, setCreatedTransactionId] = useState<string>('');
  const [niumForexOrderId, setNiumForexOrderId] = useState<string>('');
  const [partnerOrderId, setPartnerOrderId] = useState<string>('');
  const [showUploadSection, setShowUploadSection] = useState(false);

  const { transactionTypes } = useGetTransactionType();
  const { purposeTypes } = useGetPurposes();
  const createTransactionMutation = useCreateTransaction();

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
  const methods = useForm<TransactionFormData>({
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
  const onSubmit = async (formData: TransactionFormData) => {
    try {
      // Transform form data to API request
      const apiRequestData = transformFormDataToApiRequest(formData, transactionTypes, purposeTypes);
      // Call the API
      const response = await createTransactionMutation.mutateAsync(apiRequestData);

      // Extract response data based on your API specification
      const partnerOrder = response.data?.partner_order_id || formData.applicantDetails.partnerOrderId || 'PO123';
      const niumOrder = response.data?.nium_forex_order_id || 'NIUMF123';
      setCreatedTransactionId(partnerOrder); // Using partner_order_id as transaction ID
      setNiumForexOrderId(niumOrder);
      setPartnerOrderId(partnerOrder);
      setShowUploadSection(true);
      setIsDialogOpen(true);

      // Reset form after successful submission
      reset(transactionFormDefaults);
    } catch (error) {
      console.error('Form submission error:', error);
      // Handle error (show toast, etc.)
    }
  };

  const handleFormSubmit = () => {
    const formData = watchedValues;
    const manualFormData = getValues();

    console.log('Watched Values:', formData);
    console.log('GetValues Result:', manualFormData);

    // Trigger proper form submission
    handleSubmit(onSubmit)();
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
            <FormFieldRow>
              <Button className="min-w-60" onClick={handleFormSubmit}>
                Generate Order
              </Button>
            </FormFieldRow>{' '}
            {/* {showUploadSection && partnerOrderId && (
              <FormFieldRow className="mt-10">
                <FromSectionTitle>Upload Document</FromSectionTitle>
              </FormFieldRow>
            )} */}
            {showUploadSection && partnerOrderId && (
              <FormFieldRow className="mt-4">
                <UploadDocuments
                  partnerOrderId={partnerOrderId}
                  onUploadComplete={(success) => {
                    if (success) {
                      console.log('Documents uploaded successfully');
                    }
                  }}
                />
              </FormFieldRow>
            )}
          </Spacer>
        </FormContentWrapper>
      </FormProvider>
      {/* <FromSectionTitle>Rejection Summary</FromSectionTitle> */}
      {/* <RejectionSummary className="mb-4" rejectionComments={[]} /> */}{' '}
      <DialogWrapper
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        renderContent={
          <div className="flex flex-col justify-center items-center gap-4 text-lg min-h-[200px] text-gray-700">
            <Check className="text-primary font-extrabold w-12 h-12 border rounded-full p-1" />
            <div className="text-center space-y-2">
              <div>
                <span className="text-gray-600">Partner Order ID: </span>
                <span className="font-bold text-blue-600">{createdTransactionId}</span>
              </div>
              <div>
                <span className="text-gray-600">Nium Forex Order ID: </span>
                <span className="font-bold text-green-600">{niumForexOrderId}</span>
              </div>
              <div className="text-green-600 font-medium mt-4">Order created successfully!</div>
            </div>
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
