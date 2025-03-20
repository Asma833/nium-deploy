import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "./user-form.schema";
import { userFormConfig } from "./user-form-config";
import { FormProvider } from "@/components/form/context/FormProvider";
import { getController } from "@/components/form/utils/getController";
import FormFieldRow from "@/components/form/wrapper/FormFieldRow";
import FieldWrapper from "@/components/form/wrapper/FieldWrapper";
import CheckboxWrapper from "@/components/form/wrapper/CheckboxWrapper";
import Spacer from "@/components/form/wrapper/Spacer";
import { FormContentWrapper } from "@/components/form/wrapper/FormContentWrapper";
import { useCreateUser } from "../../../hooks/useCreateUser";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useParams, useLocation } from "react-router-dom";
import { useUpdateAPI } from "@/features/co-admin/hooks/useUserUpdate";
import { useProductOptions } from "@/features/co-admin/hooks/useProductOptions";
import { UserFormData } from "@/features/co-admin/types/user.type"
const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenWidth;
};

const UserCreationFormPage = () => {
  const screenWidth = useScreenSize();
  const { productOptions } = useProductOptions();

  const { id } = useParams();
  const isEditMode = !!id;
  const { setTitle } = usePageTitle();
  const location = useLocation();
  const selectedRow = (location.state as any)?.selectedRow || null;
  useEffect(() => {
    setTitle(isEditMode ? "Edit User" : "Create User");
  }, [setTitle]);
  
  const { mutate: createUser, isLoading } = useCreateUser({ role: "checker" });

  const methods = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      businessType: "large_enterprise", // Set the default value to match the selected option // This is initialized empty, not with the selected value
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
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;
  const { mutate: updateUser } = useUpdateAPI();
  const handleCheckboxChange = (
    key: "card" | "remittance" | "both",
    checked: boolean
  ) => {
    const currentValues = watch("productType"); // Get the latest state before updating

    if (key === "both") {
      // If "Both" is checked, enable all checkboxes; otherwise, disable all
      const updatedValues = {
        card: checked,
        remittance: checked,
        both: checked,
      };
      setValue("productType", updatedValues, { shouldValidate: true });
    } else {
      // Update only the specific checkbox ("Card" or "Remittance")
      setValue(`productType.${key}`, checked, { shouldValidate: true });

      // Get the updated values after modifying state
      const updatedValues = {
        ...currentValues,
        [key]: checked,
      };

      // If both "Card" and "Remittance" are checked, check "Both"
      const isBothChecked = updatedValues.card && updatedValues.remittance;
      setValue("productType.both", isBothChecked, { shouldValidate: true });

      // re-render using a temporary state change
      setValue(
        "productType",
        { ...updatedValues, both: isBothChecked },
        { shouldValidate: true }
      );
    }
  };

  useEffect(() => {
    if (selectedRow && Object.keys(selectedRow).length > 0) {
      reset({
        firstName: selectedRow.first_name || "",
        lastName: selectedRow.last_name || "",
        email: selectedRow.email || "",
        productType: {
          card:
            selectedRow.products?.some((p: any) => p.name === "Card") || true,
          remittance:
            selectedRow.products?.some((p: any) => p.name === "Remittance") ||
            false,
          both:
            selectedRow.products?.some((p: any) => p.name === "Both") || false,
        },
      });
    }
  }, [selectedRow, reset]); // Ensure `reset` runs when `selectedRow` changes



  const handleFormSubmit = handleSubmit(async (formdata:UserFormData) => {
    if (isEditMode) {
      await updateUser({ data: formdata, productOptions, id });
    } else {
     // console.log(formdata,"formdata")
      createUser({
        ...formdata,
        business_type: "",
        branch_id:"",
        bank_account_id: "",
      });
    }
  });
  
  return (
    <FormProvider methods={methods}>
     

      <FormContentWrapper className="py-2 lg:pr-32 md:pr-0">
      <h2 className="text-xl font-bold mb-4">
        {isEditMode ? "Edit User" : "Create User"}
      </h2>
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
          <FormFieldRow rowCols={screenWidth < 768 ? 1 : 2} className="mb-4">
          <FieldWrapper>
              {getController({
                ...userFormConfig.fields.email,
                name: "email",
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
                  name: "productType",
                  control,
                  errors,
                  handleCheckboxChange,
                  isMulti: true,
                })}
              </CheckboxWrapper>
            </FieldWrapper>
          </FormFieldRow>
          <FormFieldRow rowCols={screenWidth < 768 ? 1 : 2} className="mb-4">
            {Object.entries(userFormConfig.fields)
              .slice(3, 5)
              .map(([name, field]) => (
                <FieldWrapper key={name}>
                  {getController({ ...field, name, control, errors })}
                </FieldWrapper>
              ))}
          </FormFieldRow>
          <FormFieldRow rowCols={screenWidth < 768 ? 1 : 2} className="mb-4">
            <FieldWrapper>
              {/* <small className="block text-xs font-semibold">
                  {userFormConfig.fields.businessType.label || "Business Type"}
                </small> */}
              <div>
                {getController({
                  ...userFormConfig.fields.businessType,
                  label:
                    userFormConfig.fields.businessType.label || "Business Type",
                  name: "businessType",
                  control,
                  errors,
                })}
              </div>
            </FieldWrapper>
            </FormFieldRow>
        </Spacer>
      </FormContentWrapper>

      <div className="flex justify-start space-x-2 mt-4">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md"
          disabled={isSubmitting || isLoading}
          onClick={handleFormSubmit}
        >
          {isSubmitting || isLoading
            ? isEditMode
              ? "Updating..."
              : "Submitting..."
            : isEditMode
            ? "Update"
            : "Submit"}
        </button>
      </div>
    </FormProvider>
  );
};

export default UserCreationFormPage;
