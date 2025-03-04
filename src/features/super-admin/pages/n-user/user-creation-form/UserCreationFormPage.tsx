
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

  const methods = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: Object.fromEntries(
      Object.keys(userFormConfig.fields).map((key) => [key, ""])
    ),
  });

  const { handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } = methods;

  // Fetch user data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Simulate an API call (Replace with actual API call)
      const fetchUserData = async () => {
        const userData = await new Promise<{ [key: string]: any }>((resolve) =>
          setTimeout(() => resolve({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            productType: { card: true, remittance: false, both: false },
            password:"maker@123#",
            confirmPassword:"maker@123#"
          }), 1000)
        );

        reset(userData); // Patch form values
      };

      fetchUserData();
    }
  }, [id, reset, isEditMode]);

  const onSubmit = async (data: any) => {
    console.log(isEditMode ? "Updating User:" : "Creating User:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <FormProvider methods={methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white shadow-md rounded-lg max-w-full mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Update User" : "Create User"}
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
                {getController({ ...userFormConfig.fields.email, name: "email", control, errors })}
              </FieldWrapper>
              <FieldWrapper>
                <small className="block text-xs font-semibold">
                  {userFormConfig.fields.productType.label}
                </small>
                <CheckboxWrapper className="flex space-x-4 items-center">
                  {getController({ ...userFormConfig.fields.productType, name: "productType", control })}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update" : "Submit")}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UserCreationFormPage;
