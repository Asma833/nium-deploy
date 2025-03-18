import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom"; // Get ID from URL
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
import { useCreateUser } from "../../../hooks/useCreateUser"; // Import the create user hook
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/usePageTitle";

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
  const { id } = useParams(); // Get the user ID from URL (if available)
  const isEditMode = !!id; // Boolean flag for edit mode
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(isEditMode ? "Edit User" : "Create User");
  }, [setTitle]);
  const { mutate: createUser, isLoading } = useCreateUser({ role: "checker" }); // Using the create user hook

  const methods = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      productType: {
        card: true,
        remittance: false,
        both: false,
      },
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

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

      // Force re-render using a temporary state change
      setValue(
        "productType",
        { ...updatedValues, both: isBothChecked },
        { shouldValidate: true }
      );
    }
  };

  // Fetch user data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchUserData = async () => {
        const userData = await new Promise<{ [key: string]: any }>((resolve) =>
          setTimeout(
            () =>
              resolve({
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                productType: {
                  card: true,
                  remittance: false,
                  both: false,
                },
                password: "maker@123#",
                confirmPassword: "maker@123#",
              }),
            1000
          )
        );

        reset(userData); // Patch form values
      };

      fetchUserData();
    }
  }, [id, reset, isEditMode]);

  const onSubmit = async (data: any) => {
    try {
      console.log("Form Data:", data);
      if (isEditMode) {
      //  console.log("Updating User:", data);
        toast.info("User updated successfully!");
      } else {
       // console.log("Creating User:", data);
        createUser(data); 
      }
    } catch (error) {
      toast.error("Something went wrong.Please try again.");
    }
  };

  return (
    <FormProvider methods={methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white shadow-md rounded-lg max-w-full mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">User</h2>

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
            disabled={isSubmitting || isLoading}
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
      </form>
    </FormProvider>
  );
};

export default UserCreationFormPage;
