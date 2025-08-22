import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from 'react-hook-form';
import { useMemo } from 'react';
import { API } from '@/core/constant/apis';
import { useDynamicOptions } from '@/features/checker/hooks/useDynamicOptions';
import { useCreateTransactionMapping } from '@/features/admin/hooks/useCreateTransactionMapping';
import { TransactionMappingForm, TransactionMappingPayload } from '@/features/admin/types/transaction.types';
import { PurposeMasterTablePageRowData } from '@/features/admin/types/purpose.types';
import { TransactionMappingSchema } from './transaction-mapping.schema';
import { DialogSelect } from "@/components/ui/dialog-select";
import { Button } from "@/components/ui/button";

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
  // Use dynamic options from API
  const { options: transactionTypeOptions } = useDynamicOptions(API.TRANSACTION.GET_ALL_TRANSACTIONS);
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

  const { mutate: createMapping, isLoading } = useCreateTransactionMapping({
    onTransactionMappingSuccess: () => {
      reset({});
      setIsMappingModalOpen(false);
      refetch();
    },
  });

  const handleFormSubmit = handleSubmit(async (formdata: TransactionMappingForm) => {
    const selectedTransaction = transactionTypeOptions?.find((type) => type.value === formdata.transaction_name);
    createMapping({
      transaction_type_id: selectedTransaction?.typeId ?? '',
      purpose_id: rowData?.id,
    });
  });


  return (
    <div className="flex flex-col items-center justify-center w-full">
      <FormProvider {...methods}>
        <div className="p-2 rounded-lg mr-auto bg-transparent w-full">
          <div className="mt-1">
            <DialogSelect
              name="transaction_name"
              control={control}
              label="Transaction Type"
              placeholder="Select transaction type"
              options={transactionTypeOptions || []}
              required={true}
              error={errors.transaction_name?.message}
            />
          </div>

          <div className="flex justify-center space-x-2 mt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={handleFormSubmit}
              className="min-w-[150px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default TransactionMapping;
