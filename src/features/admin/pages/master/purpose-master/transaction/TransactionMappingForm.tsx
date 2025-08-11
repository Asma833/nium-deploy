import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { API } from '@/core/constant/apis';
import { useDynamicOptions } from '@/features/checker/hooks/useDynamicOptions';
import { transactionMappingFormConfig } from './transaction-mapping-form.config';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import { getController } from '@/components/form/utils/getController';
import { useCreateTransactionMapping } from '@/features/admin/hooks/useCreateTransactionMapping';
import { TransactionMappingForm, TransactionMappingPayload } from '@/features/admin/types/transaction.types';
import { PurposeMasterTablePageRowData } from '@/features/admin/types/purpose.types';
import { TransactionMappingSchema } from './transaction-mapping.schema';

const TransactionMapping = (
  { rowData , 
    setIsMappingModalOpen,
    refetch
  }: 
  { rowData: 
    PurposeMasterTablePageRowData, 
    setIsMappingModalOpen: (open: boolean) => void,
    refetch: () => void
  }) => {
  const { options: transactionTypeOptions } = useDynamicOptions(API.TRANSACTION.GET_ALL_TRANSACTIONS);
  // Format transaction types and purpose types for form controller
  const formatedTransactionTypes = transactionTypeOptions?.map((type) => ({
    typeId: type.typeId,
    label: type.value,
    value: type.value,
  }));

  const methods = useForm({
    resolver: zodResolver(TransactionMappingSchema),
    defaultValues: {
      transaction_name: '',
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const formControllerMeta = transactionMappingFormConfig({
    transactionTypes: formatedTransactionTypes,
  });

  const isEditMode = false; // Set this according to your logic
  const { mutate: createMapping, isLoading } = useCreateTransactionMapping({
    onTransactionMappingSuccess: () => {
      reset({});
      setIsMappingModalOpen(false);
      refetch();
    },
  });

  const handleFormSubmit = handleSubmit(async (formdata: TransactionMappingForm) => {
    const transactionTypeId = formatedTransactionTypes.find((type) => type.label === formdata.transaction_name)?.typeId;
    createMapping({
      transaction_type_id: transactionTypeId ?? '',
      purpose_id: rowData?.id,
    });
  });


  return (
    <div className="flex flex-col items-center justify-center w-full">
      <FormProvider {...methods}>
        <FormContentWrapper className="p-2 rounded-lg mr-auto bg-transparent w-full">
          <Spacer>
            <FormFieldRow className="mt-1" rowCols={1}>
              {Object.entries(formControllerMeta.fields).map(([name, field]) => (
                <FieldWrapper key={name}>
                  {getController({
                    ...(typeof field === 'object' && field !== null ? field : {}),
                    name,
                    control,
                    errors
                  })}
                </FieldWrapper>
              ))}
            </FormFieldRow>
          </Spacer>

          <div className="flex justify-center space-x-2 mt-4">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 mt-3 rounded-md min-w-[150px]"
              disabled={isSubmitting}
              onClick={handleFormSubmit}
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Submitting...') : isEditMode ? 'Update' : 'Submit'}
            </button>
          </div>
        </FormContentWrapper>
      </FormProvider>
    </div>
  );
};

export default TransactionMapping;
