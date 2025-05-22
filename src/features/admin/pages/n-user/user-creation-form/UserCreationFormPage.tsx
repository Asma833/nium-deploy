import { useEffect, useState } from 'react';
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
import { UserFormData } from '@/features/admin/types/user.type';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { useCreateUser } from '../../../hooks/useCreateUser';
import { userFormConfig } from './user-form.config';
import { userSchema } from './user-form.schema';

const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenWidth;
};

const UserCreationFormPage = () => {
  const screenWidth = useScreenSize();
  const { productOptions } = useProductOptions();
  const { id } = useParams();
  const { getBusinessType } = useCurrentUser();
  const isEditMode = !!id;
  const { setTitle } = usePageTitle();
  const location = useLocation();
  const selectedRow = (location.state as any)?.selectedRow || null;

  const { mutate: updateUser } = useUpdateAPI();
  const { mutate: createUser, isLoading } = useCreateUser(
    { role: 'checker' },
    {
      onUserCreateSuccess: (data) => {
        reset({});
      },
    }
  );
  const methods = useForm({
    resolver: zodResolver(userSchema),
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
    setTitle(isEditMode ? 'Edit User' : 'Create User');
  }, [setTitle]);

  useEffect(() => {
    if (selectedRow && Object.keys(selectedRow).length > 0) {
      reset({
        email: selectedRow.email || '',
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
        <FormContentWrapper className="p-2 rounded-lg w-3/5 mr-auto bg-transparent">
          <h2 className="text-xl font-bold mb-4">
            {isEditMode ? 'Edit User' : 'Create User'}
          </h2>
          <Spacer>
            <FormFieldRow rowCols={screenWidth < 768 ? 1 : 2} className="mb-4">
              <FieldWrapper>
                {getController({
                  ...userFormConfig.fields.email,
                  name: 'email',
                  control,
                  errors,
                })}
              </FieldWrapper>
              <FieldWrapper>
                <div>
                  {getController({
                    ...userFormConfig.fields.businessType,
                    label:
                      userFormConfig.fields.businessType.label ||
                      'Business Type',
                    name: 'businessType',
                    control,
                    errors,
                  })}
                </div>
              </FieldWrapper>
            </FormFieldRow>
            <FormFieldRow rowCols={screenWidth < 768 ? 1 : 2} className="mb-4">
              {Object.entries(userFormConfig.fields)
                .slice(2, 5)
                .map(([name, field]) => (
                  <FieldWrapper key={name}>
                    {getController({ ...field, name, control, errors })}
                  </FieldWrapper>
                ))}
            </FormFieldRow>
          </Spacer>
          <div className="flex justify-start space-x-2 mt-4">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-md min-w-[150px]"
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
