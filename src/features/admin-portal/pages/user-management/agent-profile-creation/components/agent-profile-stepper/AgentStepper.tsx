import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultFormValues,
  validationSchema,
} from "./config/agent-profile-form-config";
import { BasicDetailsStep } from "./steps/BasicDetailsStep";
import { AgentFormProvider } from "../../context/AgentFormProvider";
import { FormProvider } from "../../../../../../../components/form/context/FormProvider";
import { useEffect, useState } from "react";
import StepperTabs from "@/components/stepper/StepperTabs";
import { AgrementDetailsStep } from "./steps/AgrementDetailsStep";
import { useAgentForm } from "../../context/agent-form-context";
import { useInitialFormValues } from "@/components/form/context/initial-form-values-context";
import { InitialFormValuesProvider } from "@/components/form/context/InitialFormValuesProvider";

const steps = [
  {
    label: "Basic Details",
    content: <BasicDetailsStep />,
    validation: true,
  },
  {
    label: "Agreement Details",
    content: <AgrementDetailsStep />,
    validation: true,
  },
  {
    label: "Commission",
    content: <BasicDetailsStep />,
  },
  {
    label: "Charges",
    content: <BasicDetailsStep />,
  },
  {
    label: "Admin Details",
    content: <BasicDetailsStep />,
  },
  {
    label: "Document Upload",
    optional: true,
    content: <BasicDetailsStep />,
  },
];

const AgentStepperContent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { initialFormValues, setInitialValues } = useInitialFormValues();
  const [isInitialValuesSet, setIsInitialValuesSet] = useState(false);

  useEffect(() => {
    setInitialValues(defaultFormValues);
    setIsInitialValuesSet(true);
  }, [setInitialValues]);

  const methods = useForm({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: isInitialValuesSet ? initialFormValues : defaultFormValues,
  });

  // Add debug logging for form changes
  useEffect(() => {
    const subscription = methods.watch((data) => {
    });
    return () => subscription.unsubscribe();
  }, [methods, methods.watch]);

  const { saveFormData } = useAgentForm();

  const handleNext = async () => {
    const currentValues = methods.getValues();
   
    const isValid = await methods.trigger();
    if (!isValid) {
      return;
    }

    if (activeStep === steps.length - 1) {
      try {
        await saveFormData();
      } catch (error) {
      }
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <FormProvider methods={methods}>
      <StepperTabs
        steps={steps}
        activeStep={activeStep}
        onNext={handleNext}
        onBack={handleBack}
      />
    </FormProvider>
  );
};

const AgentStepper = () => {
  return (
    <AgentFormProvider>
      <InitialFormValuesProvider>
        <AgentStepperContent />
      </InitialFormValuesProvider>
    </AgentFormProvider>
  );
};

export default AgentStepper;
