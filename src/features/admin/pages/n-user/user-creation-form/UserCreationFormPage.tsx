import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../user-creation-form/user-form.schema";
import { userFormConfig } from "../user-creation-form/user-form-config";
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
  const methods = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: Object.fromEntries(
      Object.keys(userFormConfig.fields).map((key) => [key, ""])
    ),
  });
  // const methods = useForm({
  //   resolver: zodResolver(userSchema),
  //   defaultValues: {
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //     productType: {
  //       card: "",
  //       remittance: "",
  //       both: "", 
  //     },
  //   },
  // });
  

  const {handleSubmit,control,watch,formState: { errors, isSubmitting }} = methods;

  useEffect(() => {
    // Watch for changes (optional)
  }, [watch]);

  const onSubmit = async (data: any) => {
    console.log("Submitted Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <FormProvider methods={methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white shadow-md rounded-lg max-w-full mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          {userFormConfig.sectionTitle}
        </h2>

        <FormContentWrapper className="py-2 lg:pr-32 md:pr-0">
          <Spacer>
            <FormFieldRow rowCols={screenWidth < 768 ? 1 :2} className="mb-4">
              {Object.entries(userFormConfig.fields)
                .slice(0, 2)
                .map(([name, field]) => (
                  <FieldWrapper key={name}>
                    {getController({ ...field, name, control, errors })}
                  </FieldWrapper>
                ))}
            </FormFieldRow>
            <FormFieldRow rowCols={screenWidth < 768 ? 1 :2} className="mb-2">
              <FieldWrapper>
                {getController({...userFormConfig.fields.email,name: "email",control,errors})}
              </FieldWrapper>
            <FieldWrapper>
                <small className="block text-xs font-semibold">
                  {userFormConfig.fields.productType.label}
                </small>
                <CheckboxWrapper className="flex space-x-4 items-center">
                  {getController({
                    ...userFormConfig.fields.productType, 
                    name: "productType",
                    control
                  })}
                </CheckboxWrapper>
            </FieldWrapper>

            </FormFieldRow>
            <FormFieldRow rowCols={screenWidth < 768 ? 1 :2} className="mb-2">
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
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UserCreationFormPage;