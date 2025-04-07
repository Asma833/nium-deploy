import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { cn } from '@/utils/cn';
import { styled } from '@mui/material/styles';
import {
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
} from '@mui/material';
import { Check } from 'lucide-react';
import { StepperConfig, StepperTabsProps } from './stepper.types';
import { useFormContext } from 'react-hook-form';

const defaultConfig: StepperConfig = {
  styles: {
    active: 'bg-primary text-white',
    completed: 'bg-blue-500 text-white',
    pending: 'bg-[hsl(var(--optional))]',
    optional: 'bg-[hsl(var(--optional))]',
    rejected: 'bg-red-100',
    default: 'bg-[hsl(var(--primary-light))]',
  },
  labelStyles: {
    active: {
      color: 'white',
    },
    completed: {
      color: 'white',
    },
    pending: {
      color: 'text-foreground',
    },
    rejected: {
      color: 'error.main',
    },
  },
};

const QontoStepIconRoot = styled('div', {
  shouldForwardProp: (prop) => prop !== 'ownerState',
})<{ ownerState: { active?: boolean } }>(({ theme, ownerState }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  '& .QontoStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  ...theme.applyStyles('dark', {
    color: theme.palette.grey[700],
  }),
  ...(ownerState.active && {
    color: '#784af4',
  }),
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
    ...theme.applyStyles('dark', {
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
  activeStep,
  onNext,
  onBack,
  config = defaultConfig,
}: StepperTabsProps) {
  const [skipped] = React.useState(new Set<number>());
  const methods = useFormContext();

  const handleReset = () => {
    methods.reset();
    // If you need to handle additional reset logic, you can add it here
  };

  const isStepOptional = (step: number) => {
    return steps[step]?.optional ?? false;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  return (
    <Box sx={{ width: '100%' }}>
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
                'stepper-btn flex border px-3 min-w-[180px] flex-1 h-[85px] md:h-[55px] rounded-md',
                getStepStyle()
              )}
            >
              <StepLabel
                {...labelProps}
                slots={{ stepIcon: QontoStepIcon }}
                sx={{
                  '& .MuiStepLabel-label': getLabelStyle(),
                  '& .MuiStepLabel-labelContainer': {
                    color: 'var(--foreground)',
                  },
                  '& .MuiStepIcon-root': getLabelStyle(),
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
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="stepper-content">{steps[activeStep]?.content}</div>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={onBack}
              sx={{ mr: 1 }}
              variant="outlined"
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={onNext} variant="contained">
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
