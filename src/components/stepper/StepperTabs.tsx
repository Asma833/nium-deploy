import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { cn } from "@/utils/cn";
import { styled } from "@mui/material/styles";
import {
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
} from "@mui/material";
import { Check } from "lucide-react";
import { StepperConfig, StepperProps } from "./stepperTypes";

const defaultConfig: StepperConfig = {
  styles: {
    active: "bg-primary text-white",
    completed: "bg-blue-500 text-white",
    pending: "bg-[hsl(var(--optional))]",
    optional: "bg-[hsl(var(--optional))]",
    rejected: "bg-red-100",
    default: "bg-[hsl(var(--primary-light))]",
  },
  labelStyles: {
    active: {
      color: "white",
    },
    completed: {
      color: "white",
    },
    pending: {
      color: "text-foreground",
    },
    rejected: {
      color: "error.main",
    },
  },
};

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme }) => ({
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[700],
    }),
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          color: "#784af4",
        },
      },
    ],
  })
);

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot
      ownerState={{ active: active ?? false }}
      className={className}
    >
      {completed ? <Check className="text-white" /> : null}
    </QontoStepIconRoot>
  );
}

export default function StepperTabs({
  steps,
  config = defaultConfig,
  activeStep: controlledActiveStep,
  onStepChange,
  onComplete,
  showNavigation = true,
}: StepperProps) {
  const [internalActiveStep, setInternalActiveStep] = React.useState(0);
  const activeStep = controlledActiveStep ?? internalActiveStep;
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return steps[step]?.optional ?? false;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    const nextStep = activeStep + 1;
    if (nextStep === steps.length) {
      onComplete?.();
    } else {
      setInternalActiveStep(nextStep);
      onStepChange?.(nextStep);
    }
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    const prevStep = activeStep - 1;
    setInternalActiveStep(prevStep);
    onStepChange?.(prevStep);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    const nextStep = activeStep + 1;
    setInternalActiveStep(nextStep);
    onStepChange?.(nextStep);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setInternalActiveStep(0);
    onStepChange?.(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((step, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }

          const getStepStyle = () => {
            if (activeStep === index) return config.styles.active;
            if (stepProps.completed) return config.styles.completed;
            if (isStepOptional(index)) return config.styles.optional;
            return config.styles.default;
          };

          const getLabelStyle = () => {
            if (activeStep === index) return config.labelStyles.active;
            if (stepProps.completed) return config.labelStyles.completed;
            return config.labelStyles.pending;
          };

          return (
            <Step
              key={step.label}
              {...stepProps}
              className={cn(
                "stepper-btn flex border px-3 min-w-[180px] flex-1 h-[85px] md:h-[55px] rounded-md",
                getStepStyle()
              )}
            >
              <StepLabel
                {...labelProps}
                slots={{ stepIcon: QontoStepIcon }}
                sx={{
                  "& .MuiStepLabel-label": getLabelStyle(),
                  "& .MuiStepLabel-labelContainer": {
                    color: "var(--foreground)",
                  },
                  "& .MuiStepIcon-root": getLabelStyle(),
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="stepper-content">
            {steps[activeStep]?.content ?? (
              <Typography sx={{ mt: 2, mb: 1 }}>
                Step {activeStep + 1}
              </Typography>
            )}
          </div>

          {showNavigation && (
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                variant="outlined"
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )}
              <Button onClick={handleNext} variant="contained">
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          )}
        </React.Fragment>
      )}
    </Box>
  );
}
