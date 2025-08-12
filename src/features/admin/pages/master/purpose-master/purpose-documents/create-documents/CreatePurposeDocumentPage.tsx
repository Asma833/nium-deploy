import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { purposeDocumentFormSchema } from './create-purpose-document-form.shema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import { getController } from '@/components/form/utils/getController';
import Spacer from '@/components/form/wrapper/Spacer';
import { purposeDocumentFormConfig } from './create-purpose-document-form.config';
import { useCreateDocument } from '@/features/admin/hooks/useCreateDocument';
import { useUpdateMapDocument } from '@/features/admin/hooks/useUpdateDocument';

const CreatePurposeDocumentPage = ({
  setDialogTitle,
  setIsModalOpen,
  rowData,
  refetch,
}: {
  setDialogTitle: (title: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  rowData?: any;
  refetch: () => void;
}) => {
  const isEditMode = !!rowData;

  const methods = useForm({
    resolver: zodResolver(purposeDocumentFormSchema),
    defaultValues: {
      name: '',
      code: '',
      display_name: '',
      description: '',
    },
  });
  const {
    control,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;
  const { mutate: updateDocument } = useUpdateMapDocument({
    onDocumentUpdateSuccess: () => {
      reset({});
      setIsModalOpen(false);
      refetch();
    },
  });
  const { mutate: addDocument, isLoading } = useCreateDocument({
    onDocumentCreateSuccess: () => {
      reset({});
      setIsModalOpen(false);
      refetch();
    },
  });

  const handleFormSubmit = handleSubmit((data) => {
    if (isEditMode) {
      updateDocument({ id: rowData.id, data });
    } else {
      addDocument({
        ...data,
        type: '',
        fields_required: { number: '', dob: '' },
      });
    }
  });

  useEffect(() => {
    if (rowData) {
      reset({
        name: rowData.name || 'NA',
        code: rowData.code || 'NA',
        display_name: rowData.display_name || 'NA',
        description: rowData.description || 'NA',
      });
    }
  }, [rowData, reset]);

  return (
    <div className="flex flex-col items-center justify-center">
      <FormProvider {...methods}>
        <FormContentWrapper className="p-2 rounded-lg mr-auto bg-transparent w-full">
          <Spacer>
            <FormFieldRow className="mt-1" rowCols={2}>
              {Object.entries(purposeDocumentFormConfig().fields).map(([name, field]) => (
                <FieldWrapper key={name}>
                  {getController({
                    ...(typeof field === 'object' && field !== null ? field : {}),
                    name,
                    control,
                    errors,
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

export default CreatePurposeDocumentPage;
