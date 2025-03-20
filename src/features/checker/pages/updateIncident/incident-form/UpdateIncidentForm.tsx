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
import ExchangeRateDetails from "./ExchangeRateDetails";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import { UpdateIncidentRequest } from "@/features/checker/types/updateIncident.type";
import { usePageTitle } from "@/hooks/usePageTitle";
import { MaterialText } from "@/components/form/controller/MaterialText";
import { MaterialTextArea } from "@/components/form/controller/MaterialTextArea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type PropTypes = {
  formActionRight: string;
  rowData?: any;
};

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

const UpdateIncidentForm = (props: PropTypes) => {
  const { formActionRight, rowData } = props;
  console.log('rowData:', rowData)
  const screenWidth = useScreenSize();
  const { mutate: updateIncident, loading: fetchingIncidentData } =
    useUpdateIncident();

  const [showNiumInvoice, setShowNiumInvoice] = useState(true);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(true);
  const [isRejected, setIsRejected] = useState(false);

  const methods = useForm<UpdateIncidentRequest>({
    resolver: zodResolver(updateIncidentFormSchema),
    defaultValues: {
      fields: {
        niumId: "",
        cardNo: "",
        customerPan: "",
        customerName: "",
        bmfOrderRef: "",
        transactionType: "",
        purpose: "",
        buySell: "Buy",
        incidentNumber: "",
        eonInvoiceNumber: "",
        comment: "",
        status: { approve: true, reject: false },
        niumInvoiceNo: "",
      },
    },
  });

  const {
    handleSubmit,
    control,
    // reset,
    // watch,
    setValue,
    formState: { errors },
  } = methods;

  // Update form status when checkbox states change
  useEffect(() => {
    methods.setValue("fields.status", {
      approve: isApproved,
      reject: isRejected,
    });

    // Show or hide the Nium Invoice field based on selection
    setShowNiumInvoice(isApproved && !isRejected);
  }, [isApproved, isRejected, methods]);

  // Populate form with row data when available
  useEffect(() => {
    if (rowData) {
      const mappedData = {
        niumId: rowData.nium_order_id || "",
        cardNo: rowData.card_number || "",
        customerPan: rowData.customer_pan || "",
        customerName: rowData.customer_name || "",
        bmfOrderRef: rowData.partner_order_id || "",
        transactionType: rowData.transaction_type || "",
        purpose: rowData.purpose_type || "",
        buySell: rowData.buy_sell || "Buy", // Use rowData value if available
        incidentNumber: rowData.incident_number || "",
        eonInvoiceNumber: rowData.eon_invoice_number || "",
        comment: rowData.comment || "", // Use rowData value if available
        status: {
          approve: rowData.status?.approve ?? true, // Use rowData value if available
          reject: rowData.status?.reject ?? false, // Use rowData value if available
        },
        niumInvoiceNo: rowData.nium_invoice_number || "",
      };

      Object.entries(mappedData).forEach(([key, value]) => {
        setValue(`fields.${key}` as any, value);
      });

      // Set document URL if available
      if (rowData.merged_document && rowData.merged_document.url) {
        setDocumentUrl(rowData.merged_document.url);
      }

      // Set status based on rowData
      setIsApproved(rowData.status?.approve ?? true);
      setIsRejected(rowData.status?.reject ?? false);
    }
  }, [rowData, methods]);

  const handleRowCols = () => {
    return screenWidth < 768 ? 1 : 3;
  };

  const onSubmit = (data: UpdateIncidentRequest) => {
    console.log("Update Incident:", data);
    updateIncident(data);
  };

  // const handleCheckboxChange = (key: string, checked: boolean) => {
  //   methods.setValue("fields.status", {
  //     ...methods.getValues("fields.status"),
  //     [key]: checked,
  //   });
  // };

  const handleViewDocument = () => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    }
  };

  // Custom handler for the Approve checkbox
  const handleApproveChange = (checked: boolean) => {
    setIsApproved(checked);
    if (checked) {
      setIsRejected(false); // Uncheck reject when approve is checked
    }
  };

  // Custom handler for the Reject checkbox
  const handleRejectChange = (checked: boolean) => {
    setIsRejected(checked);
    if (checked) {
      setIsApproved(false); // Uncheck approve when reject is checked
    }
  };

  return (
    <FormProvider methods={methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white mx-auto">
        <FormContentWrapper className="py-2 mt-0 rounded-none">
          <Spacer>
            {/* First Row */}

            <FormFieldRow rowCols={handleRowCols()}>
              {Object.entries(updateFormIncidentConfig.basicDetails).map(
                ([name, field]) => {
                  const hasError = !!errors[name as keyof typeof errors];
                  return (
                    <FieldWrapper
                      key={name}
                      className={cn("w-full", hasError ? "mb-8" : "mb-2")}
                    >
                      {getController({
                        ...field,
                        name,
                        control,
                        errors,
                        disabled: formActionRight === "view",
                        forcedValue: rowData?.[field.name],
                      })}
                    </FieldWrapper>
                  );
                }
              )}
            </FormFieldRow>
            <FormFieldRow rowCols={handleRowCols()}>
              {Object.entries(updateFormIncidentConfig.buySellType).map(
                ([name, field]) => {
                  const hasError = !!errors[name as keyof typeof errors];
                  return (
                    <FieldWrapper
                      key={name}
                      className={cn("w-full", hasError ? "mb-8" : "mb-2")}
                    >
                      {getController({
                        ...field,
                        name,
                        control,
                        errors,
                        disabled: formActionRight === "view",
                      })}
                    </FieldWrapper>
                  );
                }
              )}
            </FormFieldRow>

            {/* Exchange Rate Details */}
            <ExchangeRateDetails data={updateFormIncidentConfig.tableData} />

            <FormFieldRow rowCols={handleRowCols()}>
              <Button
                type="button"
                onClick={handleViewDocument}
                disabled={!documentUrl}
              >
                View Document
              </Button>
            </FormFieldRow>

            {/* Replace the CheckboxWrapper with shadcn Checkbox components */}
            <FormFieldRow rowCols={handleRowCols()}>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="approve"
                    checked={isApproved}
                    onCheckedChange={handleApproveChange}
                  />
                  <Label htmlFor="approve" className="cursor-pointer">
                    Approve
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reject"
                    checked={isRejected}
                    onCheckedChange={handleRejectChange}
                  />
                  <Label htmlFor="reject" className="cursor-pointer">
                    Reject
                  </Label>
                </div>
              </div>
            </FormFieldRow>

            <FormFieldRow rowCols={1}>
              <MaterialTextArea
                name="fields.comment"
                label="Comment"
                required={isRejected}
              />
              {showNiumInvoice && (
                <MaterialText
                  name="fields.niumInvoiceNo"
                  label="Nium Invoice Number"
                  required={isApproved}
                />
              )}
            </FormFieldRow>
          </Spacer>
        </FormContentWrapper>

        {/* Submit Button */}
        <div className="flex justify-center bg-background">
          <Button type="submit" disabled={fetchingIncidentData}>
            {fetchingIncidentData ? (
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
