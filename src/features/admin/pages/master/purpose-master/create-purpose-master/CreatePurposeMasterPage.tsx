import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { getController } from '@/components/form/utils/getController';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import Spacer from '@/components/form/wrapper/Spacer';
import { zodResolver } from '@hookform/resolvers/zod';
import { purposeMasterSchema } from './create-purpose-master.schema';
import { purposeMasterConfig } from './create-purpose-master.config';
import { PurposeApiPayload } from '@/features/admin/types/purpose.types';
import { useCreatePurposeMaster } from '@/features/admin/hooks/useCreatePurposeMaster';
import { useUpdatePurposeMaster } from '@/features/admin/hooks/useUpdatePurposeMaster';

const CreatePurposeMasterPage = ({
  setDialogTitle,
  rowData,
  refetch,
  setIsModalOpen,
}: {
  setDialogTitle: (title: string) => void;
  rowData: any;
  refetch: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const isEditMode = !!rowData;
  const methods = useForm({
    resolver: zodResolver(purposeMasterSchema),
    defaultValues: {
      purpose_name: '',
      purpose_code: '',
    },
  });
  const {
    control,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;

  const { mutate: createPurpose, isLoading } = useCreatePurposeMaster({
    onPurposeCreateSuccess: () => {
      reset({});
      setIsModalOpen(false);
      refetch();
    },
  });
  const { mutate: updatePurpose } = useUpdatePurposeMaster({
    onPurposeUpdateSuccess: () => {
      setIsModalOpen(false);
      refetch();
    },
  });

  const handleAddPurpose = handleSubmit(async (formdata: PurposeApiPayload) => {
    if (isEditMode) {
      await updatePurpose({ data: formdata, id: rowData.id });
    } else {
      createPurpose({
        ...formdata,
      });
    }
  });
  useEffect(() => {
    const title = isEditMode ? 'Edit Purpose' : 'Add Purpose';
    setDialogTitle(title);
  }, [isEditMode, setDialogTitle]);

  useEffect(() => {
    if (rowData) {
      reset({
        purpose_name: rowData.purpose_name,
        purpose_code: rowData.purpose_code,
      });
    }
  }, [rowData, reset]);
  return (
    <FormProvider {...methods}>
      <FormContentWrapper className="rounded-lg mr-auto bg-transparent w-full">
        <Spacer>
          <FormFieldRow className="mb-4 mt-1" rowCols={2} wrapperClassName="justify-center">
            {Object.entries(purposeMasterConfig.fields)
              .slice(0, 2)
              .map(([name, field]) => (
                <FieldWrapper key={name}>
                  {getController({
                    ...(typeof field === 'object' && field !== null ? field : {}),
                    name,
                    control,
                    errors,
                  })}
                </FieldWrapper>
              ))}
            <div className="">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2.5  rounded-md min-w-[150px] h-fit"
                disabled={isSubmitting}
                onClick={handleAddPurpose}
              >
                {isSubmitting ? (isEditMode ? 'Updating...' : 'Submitting...') : isEditMode ? 'Update' : 'Submit'}
              </button>
            </div>
          </FormFieldRow>
        </Spacer>
      </FormContentWrapper>
    </FormProvider>
  );
};

export default CreatePurposeMasterPage;
