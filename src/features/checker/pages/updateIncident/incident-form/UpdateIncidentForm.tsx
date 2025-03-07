import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateIncidentFormSchema, UpdateIncidentFormType } from "./update-incident-form.schema";
import { useState, useEffect } from "react";
import { FormProvider } from "@/components/form/context/FormProvider";
import { getController } from "@/components/form/utils/getController";
import FormFieldRow from "@/components/form/wrapper/FormFieldRow";
import FieldWrapper from "@/components/form/wrapper/FieldWrapper";
import Spacer from "@/components/form/wrapper/Spacer";
import { FormContentWrapper } from "@/components/form/wrapper/FormContentWrapper";
import { updateFormIncidentConfig } from "../incident-form/update-incident-form.config";
import CheckboxWrapper from "@/components/form/wrapper/CheckboxWrapper";
import ExchangeRateDetails from "./ExchangeRateDetails";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenWidth;
};

const UpdateIncidentForm = ({ onSubmit }: { onSubmit: (data: UpdateIncidentFormType) => void }) => {
  const screenWidth = useScreenSize();

  const methods = useForm<UpdateIncidentFormType>({
    resolver: zodResolver(updateIncidentFormSchema),
    defaultValues: {
      status: "approve",
      tableData: updateFormIncidentConfig.tableData,
    },
  });

  const { handleSubmit, control, formState: { errors } } = methods;
  const [isLoading] = useState(false);

  

  return (
    <FormProvider methods={methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white mx-auto">
        <FormContentWrapper className="py-2 mt-0 rounded-none">
          <Spacer>
            <FormFieldRow rowCols={screenWidth < 768 ? 1 : 3} className={cn("gap-3", errors && Object.keys(errors).length > 0 ? "mb-8" : "mb-4")}>
              {Object.entries(updateFormIncidentConfig.fields).slice(0,3).map(([name, field]) => (
                <FieldWrapper key={name} className="w-full">
                  {getController({ ...field, name, control, errors })}
                </FieldWrapper>
              ))}
            </FormFieldRow>

            <FormFieldRow rowCols={screenWidth < 768 ? 1 : 3} className={cn("gap-3", errors && Object.keys(errors).length > 0 ? "mb-8" : "mb-4")}>
              {Object.entries(updateFormIncidentConfig.fields).slice(3,6).map(([name, field]) => (
                <FieldWrapper key={name} className="w-full">
                  {getController({ ...field, name, control, errors })}
                </FieldWrapper>
              ))}
            </FormFieldRow>

            <ExchangeRateDetails data={updateFormIncidentConfig.tableData} />

            <FormFieldRow rowCols={screenWidth < 768 ? 1 : 3} className={cn("gap-3", errors && Object.keys(errors).length > 0 ? "mb-8" : "mb-4")}>
              <FieldWrapper>
                <div className="flex space-x-4">
                  <button type="button" className="bg-primary text-white px-6 py-3 my-1 text-sm rounded-md">
                    View Document
                  </button>
                </div>
              </FieldWrapper>
              <FieldWrapper>
                <small className="block text-sm font-semibold">
                  {updateFormIncidentConfig.fields.status.label}
                </small>
                <CheckboxWrapper className="flex space-x-4 items-center" >
                  {getController({ ...updateFormIncidentConfig.fields.status, name: "status", control })}
                </CheckboxWrapper>
              </FieldWrapper>
              <FieldWrapper>
                {getController({ ...updateFormIncidentConfig.fields.eonInvoiceNumber, name: "eonInvoiceNumber", control, errors })}
              </FieldWrapper>
            </FormFieldRow>

            <FormFieldRow rowCols={1} className={cn("gap-3", errors && Object.keys(errors).length > 0 ? "mb-8" : "mb-4")}>
              {Object.entries(updateFormIncidentConfig.fields).slice(8,9).map(([name, field]) => (
                <FieldWrapper key={name} className="w-full">
                  {getController({ ...field, name, control, errors })}
                </FieldWrapper>
              ))}
            </FormFieldRow>
          </Spacer>
        </FormContentWrapper>

        <div className="flex justify-center bg-transparent">
        <Button  type="submit" disabled={isLoading} >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
        </div>
       
      </form>
    </FormProvider>
  );
};

export default UpdateIncidentForm;
