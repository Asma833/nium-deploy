import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useUpdateIncident } from "../../../hooks/useUpdateIncident";
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
import useSubmitIncidentFormData from "./useSubmitIncidentFormData";
import { toast } from "sonner";
import { useCurrentUser } from "@/utils/getUserFromRedux";
import { transactionTypeMapping } from "@/utils/transactionTypesConfig";
import {
  determineBuySell,
  determinePurposeType,
  determineTransactionType,
} from "@/utils/getTransactionConfigTypes";

type PropTypes = {
  formActionRight: string;
  rowData?: any;
  setIsModalOpen: (isOpen: boolean) => void;
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
  const { formActionRight, rowData, setIsModalOpen } = props;
  console.log("rowData:===>", rowData);
  const screenWidth = useScreenSize();
  const { getUserHashedKey } = useCurrentUser();
  const { submitIncidentFormData, isPending } = useSubmitIncidentFormData();
  const [showNiumInvoice, setShowNiumInvoice] = useState(true);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(true);
  const [isRejected, setIsRejected] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Transaction type to Buy/Sell mapping

  // Function to determine buy/sell based on transaction type

  // State to track if we should show the buy/sell field
  const [showBuySell, setShowBuySell] = useState(true);

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
        niumInvoiceNumber: "",
      },
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  // Function to reset form to initial state
  const resetFormValues = () => {
    reset({
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
        niumInvoiceNumber: "",
      },
    });
    setIsApproved(true);
    setIsRejected(false);
    setDocumentUrl(null);
    setShowNiumInvoice(true);
    setShowBuySell(true);
  };

  // Reset form when modal is closed
  useEffect(() => {
    return () => {
      // This cleanup function runs when the component unmounts
      resetFormValues();
    };
  }, []);

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
      const buySellValue = determineBuySell(rowData.transaction_type);
      console.log("rowData.transaction_type:", rowData.transaction_type);

      const purposeTypeText = determinePurposeType(rowData.purpose_type);
      console.log("rowData.purpose_type:", rowData.purpose_type);

      const shouldShowBuySell = buySellValue !== null;
      setShowBuySell(shouldShowBuySell);

      const mappedData = {
        niumId: rowData.nium_order_id || "",
        cardNo: rowData.card_number || "",
        customerPan: rowData.customer_pan || "",
        customerName: rowData.customer_name || "",
        bmfOrderRef: rowData.partner_order_id || "",
        transactionType: rowData.transaction_type || "",
        purpose: purposeTypeText || "",
        buySell: buySellValue || "",
        incidentNumber: rowData.incident_number || "",
        eonInvoiceNumber: rowData.eon_invoice_number || "",
        // comment: rowData.comment || "",
        status: {
          approve: rowData.status?.approve ?? true,
          reject: rowData.status?.reject ?? false,
        },
        // niumInvoiceNo: rowData.nium_invoice_number || "",
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

  // Add validation check whenever relevant form values change
  useEffect(() => {
    const comment = methods.getValues("fields.comment");
    const niumInvoiceNumber = methods.getValues("fields.niumInvoiceNumber");

    let valid = true;

    if (isApproved && !niumInvoiceNumber) {
      valid = false;
    }

    if (isRejected && !comment) {
      valid = false;
    }

    setIsFormValid(valid);
  }, [isApproved, isRejected, methods]);

  // Update watch for form values
  const [comment, niumInvoiceNumber] = methods.watch([
    "fields.comment",
    "fields.niumInvoiceNumber",
  ]);

  // Update validation whenever these values change
  useEffect(() => {
    const valid = !!(
      (isApproved && niumInvoiceNumber) ||
      (isRejected && comment)
    );
    setIsFormValid(valid);
  }, [isApproved, isRejected, comment, niumInvoiceNumber]);

  const handleRowCols = () => {
    return screenWidth < 768 ? 1 : 3;
  };

  const handleFormSubmit = async () => {
    try {
      await handleSubmit(async (data) => {
        const { fields } = data;

        if (fields) {
          if (fields?.status?.approve && !fields.niumInvoiceNumber) {
            toast.error(
              "Nium Invoice Number is required when approving an incident"
            );
            return;
          }
        }

        const formattedData = {
          partner_order_id: fields.bmfOrderRef || "",
          checker_id: getUserHashedKey() || "",
          nium_invoice_number: fields?.status?.approve
            ? fields.niumInvoiceNumber || ""
            : "",
          incident_checker_comments: fields.comment || "",
          incident_status: fields?.status?.approve ? true : false,
        };

        await submitIncidentFormData(formattedData, {
          onSuccess: () => {
            toast.success("Incident updated successfully");
            resetFormValues(); // Reset form after successful submission
            setIsModalOpen(false); // Ensure this runs after successful submission
          },
          onError: (error) => {
            toast.error(error?.message || "Failed to update incident");
          },
        });
      })();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Form submission failed. Please check your inputs.");
    }
  };

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
      <FormContentWrapper className="py-2 mt-0 rounded-none">
        <Spacer>
          <FormFieldRow rowCols={handleRowCols()}>
            {Object.entries(updateFormIncidentConfig.basicDetails)
              .slice(1, 5)
              .map(([name, field]) => {
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
              })}
          </FormFieldRow>
          <FormFieldRow rowCols={handleRowCols()}>
            {Object.entries(updateFormIncidentConfig.basicDetails)
              .slice(5, 6)
              .map(([name, field]) => {
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
                      forcedValue: determineTransactionType(
                        rowData?.[field.name]
                      ),
                    })}
                  </FieldWrapper>
                );
              })}
            {Object.entries(updateFormIncidentConfig.basicDetails)
              .slice(6, 7)
              .map(([name, field]) => {
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
                      forcedValue: determinePurposeType(rowData?.[field.name]),
                    })}
                  </FieldWrapper>
                );
              })}
          </FormFieldRow>
          {/* buy/sell */}
          {showBuySell && (
            <FormFieldRow rowCols={handleRowCols()}>
              <FieldWrapper
                id="buy-sell"
                className={cn(
                  "w-full",
                  errors.fields?.buySell ? "mb-8" : "mb-2"
                )}
              >
                <MaterialText
                  name="fields.buySell"
                  label="Transaction Mode"
                  disabled={true} // Always disabled since it's determined by transaction type
                />
              </FieldWrapper>
            </FormFieldRow>
          )}

          {/* <ExchangeRateDetails data={updateFormIncidentConfig.tableData} /> */}

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

          <FormFieldRow rowCols={2}>
            <FormFieldRow className="flex-1">
              <MaterialTextArea
                name="fields.comment"
                label="Comment"
                required={isRejected}
                className="w-full rounded-lg"
                error={
                  isRejected && !comment
                    ? "Comment is required when rejecting"
                    : ""
                }
              />
            </FormFieldRow>
            <FormFieldRow className="flex-1">
              {showNiumInvoice && (
                <MaterialText
                  name="fields.niumInvoiceNumber"
                  label="Nium Invoice Number"
                  required={isApproved}
                  error={
                    isApproved && !niumInvoiceNumber
                      ? "Nium Invoice Number is required when approving"
                      : ""
                  }
                />
              )}
            </FormFieldRow>
          </FormFieldRow>
        </Spacer>
      </FormContentWrapper>

      {/* Submit Button */}
      <div className="flex justify-center bg-background">
        <Button disabled={isPending} onClick={handleFormSubmit}>
          {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
        </Button>
      </div>
    </FormProvider>
  );
};

export default UpdateIncidentForm;
