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
  steps: StepConfig[];
  config?: StepperConfig;
  activeStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  showNavigation?: boolean;
}
