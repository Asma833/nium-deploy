import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from '@/components/form/providers/FormProvider';
import { getController } from '@/components/form/utils/getController';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useUpdateAPI } from '@/features/admin/hooks/useUserUpdate';
import { useProductOptions } from '@/features/admin/hooks/useProductOptions';
import { UserFormData } from '@/features/admin/types/user.types';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { useCreateUser } from '@/features/admin/hooks/useCreateUser';

interface UserCreationFormPageProps {
  formConfig: any;
  schema: any;
  role: string;
  title?: string;
}

const UserCreationFormPage = ({ formConfig, schema, role }: UserCreationFormPageProps) => {
  const { productOptions } = useProductOptions();
  const { id } = useParams();
  const { getBusinessType } = useCurrentUser();
  const isEditMode = !!id;
  const { setTitle } = usePageTitle();
  const location = useLocation();
  const selectedRow = (location.state as any)?.selectedRow || null;
  const pageTitle = isEditMode ? `Edit ${role}` : `Create ${role}`;

  const { mutate: updateUser } = useUpdateAPI({ role });
  const { mutate: createUser, isLoading } = useCreateUser(
    { role: role.toLowerCase() },
    {
      onUserCreateSuccess: () => {
        reset({});
      },
    }
  );

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      businessType: getBusinessType() || '',
    },
  });

  const {
    control,
    reset,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;

  useEffect(() => {
    setTitle(pageTitle);
  }, [setTitle, pageTitle]);

  useEffect(() => {
    if (selectedRow && Object.keys(selectedRow).length > 0) {
      reset({
        email: selectedRow.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [selectedRow, reset]);

  const handleFormSubmit = handleSubmit(async (formdata: UserFormData) => {
    if (isEditMode) {
      await updateUser({ data: formdata, productOptions, id });
    } else {
      createUser({
        ...formdata,
        business_type: '',
        branch_id: '',
        bank_account_id: '',
      });
    }
  });

  return (
    <>
      <FormProvider methods={methods}>
        <FormContentWrapper className="p-2 rounded-lg mr-auto bg-transparent">
          <h2 className="text-xl font-bold mb-4 title-case">{pageTitle}</h2>
          <Spacer>
            <FormFieldRow>
              <FieldWrapper>
                {getController({
                  ...formConfig.fields.email,
                  name: 'email',
                  control,
                  errors,
                })}
              </FieldWrapper>
              {/* <FieldWrapper>
                <div>
                  {getController({
                    ...formConfig.fields.businessType,
                    label: formConfig.fields.businessType.label || 'Business Type',
                    name: 'businessType',
                    control,
                    errors,
                  })}
                </div>
              </FieldWrapper> */}
            </FormFieldRow>
            <FormFieldRow className="mt-1">
              {Object.entries(formConfig.fields)
                .slice(2, 3)
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
            </FormFieldRow>
            <FormFieldRow className="mt-2">
              {Object.entries(formConfig.fields)
                .slice(3, 4)
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
            </FormFieldRow>
          </Spacer>

          <div className="flex justify-start space-x-2 mt-4">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 mt-3 rounded-md min-w-[150px]"
              disabled={isSubmitting || isLoading}
              onClick={handleFormSubmit}
            >
              {isSubmitting || isLoading
                ? isEditMode
                  ? 'Updating...'
                  : 'Submitting...'
                : isEditMode
                  ? 'Update'
                  : 'Submit'}
            </button>
          </div>
        </FormContentWrapper>
      </FormProvider>
    </>
  );
};

export default UserCreationFormPage;
