import { useForm } from "react-hook-form";
import { FormProvider } from "@/components/form/context/FormProvider";
import StepperTabs from "@/components/stepper/StepperTabs";
import { BasicDetailsStep } from "./steps/BasicDetailsStep";
import AdminDetailsStep from "./steps/AdminDetailsStep";
import CommissionStep from "./steps/CommissionStep";
import ChargesStep from "./steps/ChargesStep";
import DocumentUploadStep from "./steps/DocumentUploadStep";
import AggrementDetailsStep from "./steps/AgrementDetailsStep";

const steps = [
  {
    label: "Basic Details",
    content: <BasicDetailsStep />,
  },
  {
    label: "Agreement Details",
    content: <AggrementDetailsStep />,
  },
  {
    label: "Commission",
    content: <CommissionStep />,
  },
  {
    label: "Charges",
    content: <ChargesStep />,
  },
  {
    label: "Admin Details",
    content: <AdminDetailsStep />,
  },
  {
    label: "Document Upload",
    optional: true,
    content: <DocumentUploadStep />,
  },
];

const AgentStepper = () => {
  const methods = useForm();

  return (
    <FormProvider methods={methods}>
      <StepperTabs
        steps={steps}
        onStepChange={(step) => console.log("Step changed to:", step)}
        onComplete={() => console.log("Stepper completed")}
      />
    </FormProvider>
  );
};

export default AgentStepper;
