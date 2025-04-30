import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider } from '@/components/form/context/FormProvider';
import { getController } from '@/components/form/utils/getController';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import CheckboxWrapper from '@/components/form/wrapper/CheckboxWrapper';
import Spacer from '@/components/form/wrapper/Spacer';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useParams, useLocation } from 'react-router-dom';
import { useCreatePartner } from '@/features/admin/hooks/useCreatePartners';
import { usePartnerUpdateAPI } from '@/features/admin/hooks/usePartnerUpdate';
import { useProductOptions } from '@/features/admin/hooks/useProductOptions';
import { PartnerFormData } from '@/features/admin/types/partner.type';
import { useCurrentUser } from '@/utils/getUserFromRedux';
import { userFormConfig } from './partner-form-config';
import { userSchema } from './partner-form.schema';

const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenWidth;
};

const PartnerCreationFormPage = () => {
  const screenWidth = useScreenSize();
  const { productOptions } = useProductOptions();
  const { id } = useParams();
  const isEditMode = !!id;
  const { setTitle } = usePageTitle();
  const location = useLocation();
  const selectedRow = (location.state as any)?.selectedRow || null;
  const roleCode = 'checker';

  const { getUser } = useCurrentUser();
  const user = getUser();

  useEffect(() => {
    setTitle(isEditMode ? 'Edit Partner' : 'Create Partner');
  }, [setTitle, isEditMode]);

  const {
    mutate: createPartner,
    isLoading: isCreating,
    error: createError,
  } = useCreatePartner(roleCode, {
    onUserCreateSuccess: () => {
      reset({});
      toast.success('Partner created successfully');
    },
    productOptions,
  });

  const {
    mutate: updatePartner,
    isLoading: isUpdating,
    error: updateError,
  } = usePartnerUpdateAPI();

  const methods = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessType: '',
      productType: {
        card: true,
        remittance: false,
        both: false,
      },
    },
  });

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const handleCheckboxChange = (
    key: 'card' | 'remittance' | 'both',
    checked: boolean
  ) => {
    const currentValues = watch('productType');

    if (key === 'both') {
      setValue(
        'productType',
        {
          card: checked,
          remittance: checked,
          both: checked,
        },
        { shouldValidate: true }
      );
      return;
    }

    // For card/remittance, set 'both' to true only if both are checked
    const updatedValues = {
      ...currentValues,
      [key]: checked,
      both:
        (key === 'card' && checked && currentValues.remittance) ||
        (key === 'remittance' && checked && currentValues.card),
    };

    setValue('productType', updatedValues, { shouldValidate: true });
  };

  useEffect(() => {
    if (selectedRow && Object.keys(selectedRow).length > 0) {
      const productTypeValues = {
        card:
          selectedRow.products?.some(
            (p: any) => p.name.toLowerCase() === 'card'
          ) || false,
        remittance:
          selectedRow.products?.some(
            (p: any) => p.name.toLowerCase() === 'remittance'
          ) || false,
        both: false,
      };

      reset({
        firstName: selectedRow.first_name || '',
        lastName: selectedRow.last_name || '',
        email: selectedRow.email || '',
        businessType: selectedRow.business_type || '',
        productType: {
          ...productTypeValues,
          both: productTypeValues.card && productTypeValues.remittance,
        },
      });
    }
  }, [selectedRow, reset]);

  const handleFormSubmit = handleSubmit(async (formdata: PartnerFormData) => {
    try {
      if (!formdata.productType.card && !formdata.productType.remittance) {
        toast.error('Please select at least one product type');
        return;
      }

      if (isEditMode) {
        await updatePartner({
          data: {
            ...formdata,
            isActive: selectedRow?.is_active ?? true,
            role: selectedRow?.role_id,
          },
          productOptions,
        });
      } else {
        await createPartner({
          ...formdata,
          isActive: true,
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  });

  // Show API errors if any
  useEffect(() => {
    const error = createError || updateError;
    if (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  }, [createError, updateError]);

  return (
    <FormProvider methods={methods}>
      <h2 className="text-xl font-bold mb-4">
        {isEditMode ? 'Edit Partner' : 'Create Partner'}
      </h2>

      <FormContentWrapper className="py-2 lg:pr-32 md:pr-0">
        <Spacer>
          <FormFieldRow rowCols={screenWidth < 768 ? 1 : 2} className="mb-4">
            {Object.entries(userFormConfig.fields)
              .slice(0, 2)
              .map(([name, field]) => (
                <FieldWrapper key={name}>
                  {getController({ ...field, name, control, errors })}
                </FieldWrapper>
              ))}
          </FormFieldRow>
          <FormFieldRow rowCols={screenWidth < 768 ? 1 : 2} className="mb-2">
            <FieldWrapper>
              {getController({
                ...userFormConfig.fields.email,
                name: 'email',
                control,
                errors,
              })}
            </FieldWrapper>
            <FieldWrapper>
              <small className="block text-xs font-semibold">
                {userFormConfig.fields.productType.label}
              </small>
              <CheckboxWrapper className="flex space-x-4 items-center">
                {getController({
                  ...userFormConfig.fields.productType,
                  name: 'productType',
                  control,
                  errors,
                  handleCheckboxChange,
                  isMulti: true,
                })}
              </CheckboxWrapper>
            </FieldWrapper>
          </FormFieldRow>

          <FormFieldRow rowCols={screenWidth < 768 ? 1 : 2} className="mb-2">
            {Object.entries(userFormConfig.fields)
              .slice(3, 5)
              .map(([name, field]) => (
                <FieldWrapper key={name}>
                  {getController({ ...field, name, control, errors })}
                </FieldWrapper>
              ))}
          </FormFieldRow>
        </Spacer>
      </FormContentWrapper>

      <div className="flex justify-start space-x-2 mt-4">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md"
          disabled={isSubmitting || isCreating || isUpdating}
          onClick={handleFormSubmit}
        >
          {isSubmitting || isCreating || isUpdating
            ? isEditMode
              ? 'Updating...'
              : 'Submitting...'
            : isEditMode
              ? 'Update'
              : 'Submit'}
        </button>
      </div>
    </FormProvider>
  );
};

export default PartnerCreationFormPage;
