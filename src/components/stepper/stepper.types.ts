import { initialState } from "./reducers/stepperReducer";

export interface StepperStyles {
  active: string;
  completed: string;
  pending: string;
  optional: string;
  rejected: string;
  default: string;
}

export interface StepperLabelStyles {
  active: Record<string, string | number>;
  completed: Record<string, string | number>;
  pending: Record<string, string | number>;
  rejected: Record<string, string | number>;
}

export interface StepperConfig {
  styles: StepperStyles;
  labelStyles: StepperLabelStyles;
}

export interface StepConfig {
  label: string;
  optional?: boolean;
  content?: React.ReactNode;
}

export interface StepperProps {
  steps: Array<{
    label: string;
    content: React.ReactNode;
    validation?: boolean;
    optional?: boolean;
    validationSchema?: any;
    onNext?: () => Promise<void>;
  }>;
  config?: StepperConfig;
  activeStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  showNavigation?: boolean;
  handleNext?: (
    activeStep: number,
    setActiveStep: (step: number) => void
  ) => Promise<void>;
}

export interface StepperProviderProps {
  children: React.ReactNode;
  steps: { id: string; label: string }[]; // Adjust the shape of steps as needed
  onComplete: (data: any) => Promise<void>; // Adjust the type of data as needed
}


export interface StepperContextType {
  state: typeof initialState;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  setStepValid: (stepId: string, isValid: boolean) => void;
}

export interface FormState {
  currentStep: number;
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  data: Record<string, any>;
}

export interface StepperTabsProps {
  steps: Array<{
    label: string;
    content: React.ReactNode;
    validation?: boolean;
    optional?: boolean;
  }>;
  activeStep: number;
  onNext: () => Promise<void>;
  onBack: () => void;
  isStepValid?: (step: string) => boolean;
  config?: StepperConfig;
}
