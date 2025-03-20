
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateIncident } from "../../../hooks/useUpdateIncident";
import { updateIncidentFormSchema } from "./update-incident-form.schema";
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
import { UpdateIncidentRequest } from "@/features/checker/types/updateIncident.type";
import { usePageTitle } from "@/hooks/usePageTitle";


const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const { setTitle } = usePageTitle();
  useEffect(() => {
    setTitle("Update Incident");
  }, [setTitle]);
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenWidth;
};

const UpdateIncidentForm = () => {
  const screenWidth = useScreenSize();
  const { mutate: updateIncident, isLoading } = useUpdateIncident(); // Use mutation hook

  const methods = useForm<UpdateIncidentRequest>({
    resolver: zodResolver(updateIncidentFormSchema),
    defaultValues: {
      fields: {
        passportNumber: "",
        cardNumber: "",
        departureDate: "",
        incidentNumber: "",
        buySell: "Buy",
        transactionType: "",
        eonInvoiceNumber: "",
        comment: "",
        status: { approve: true, reject: false }
        
      }
    },
  });

  const { handleSubmit, control, formState: { errors }} = methods;
  const handleRowCols = ()=>{
    return screenWidth < 768 ? 1 : 3
  }
  
  const onSubmit = (data: UpdateIncidentRequest) => {
    console.log("Update Incident:", data);
   updateIncident(data); 
  };
  const handleCheckboxChange = (key: string) => (checked: boolean) => {
    methods.setValue("fields.status", {
      ...methods.getValues("fields.status"), // Preserve existing values
      [key]: checked, // Update only the specific checkbox
    });
  };
  
  return (
    <FormProvider methods={methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white mx-auto">
        <FormContentWrapper className="py-2 mt-0 rounded-none">
          <Spacer>
            {/* First Row */}
            
            <FormFieldRow rowCols={handleRowCols()}>
              {Object.entries(updateFormIncidentConfig.fields).slice(0, 3).map(([name, field]) => {
                const hasError = !!errors[name as keyof typeof errors]; 
                return (
                  <FieldWrapper 
                    key={name} 
                    className={cn("w-full", hasError ? "mb-8" : "mb-2")}
                  >
                    {getController({ ...field, name, control, errors })}
                  </FieldWrapper>
                );
              })}
            </FormFieldRow>


            {/* Second Row */}
            <FormFieldRow rowCols={handleRowCols()}>
              {Object.entries(updateFormIncidentConfig.fields).slice(3,6).map(([name, field]) =>{
              const hasError = !!errors[name as keyof typeof errors];
              return (   
                <FieldWrapper key={name} className={cn("w-full", hasError ? "mb-8" : "mb-2")}>
                  {getController({ ...field, name, control, errors})}
                </FieldWrapper>
              )
              })}
            </FormFieldRow>

            {/* Exchange Rate Details */}
            <ExchangeRateDetails data={updateFormIncidentConfig.tableData} />

            {/* Status and EON Invoice Number */}
            <FormFieldRow rowCols={handleRowCols()} 
            className={cn(Object.keys(errors).some(key => key in updateFormIncidentConfig.fields) ? "mb-8" : "mb-2", "mt-2")}>
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
                  {getController({ 
                    ...updateFormIncidentConfig.fields.status,
                    name: "status",
                    control,
                    errors,
                    isMulti: false,
                    defaultSelected:{approve:true,reject:false},
                    handleCheckboxChange
                  })}
                </CheckboxWrapper>
               
              </FieldWrapper>
              <FieldWrapper>
                {getController({ ...updateFormIncidentConfig.fields.eonInvoiceNumber, name: "eonInvoiceNumber", control, errors })}
              </FieldWrapper>
            </FormFieldRow>

            {/* Comment Field */}
            <FormFieldRow rowCols={1} >
              {Object.entries(updateFormIncidentConfig.fields).slice(8,9).map(([name, field]) =>{ 
              const hasError = !!errors[name as keyof typeof errors];
              return(
                
                <FieldWrapper key={name} className={cn("w-full", hasError ? "mb-8" : "mb-2")}>
                  {getController({ ...field, name, control, errors })}
                </FieldWrapper>
              )
              })}
            </FormFieldRow>
          </Spacer>
        </FormContentWrapper>

        {/* Submit Button */}
        <div className="flex justify-center bg-background">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Submit"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UpdateIncidentForm;
