import { FormState } from '../stepper.types';

export type StepperAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP_VALID'; payload: { stepId: string; isValid: boolean } }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Record<string, string> }
  | { type: 'UPDATE_DATA'; payload: Record<string, any> };

// Define or import the FormState type

export const initialState: FormState = {
  currentStep: 0,
  isSubmitting: false,
  isValid: false,
  errors: {},
  data: {},
};

export const stepperReducer = (
  state: FormState,
  action: StepperAction
): FormState => {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: state.currentStep - 1,
      };
    case 'SET_STEP_VALID':
      return {
        ...state,
        isValid: action.payload.isValid,
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: action.payload,
      };
    case 'UPDATE_DATA':
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
