import Grid from "@mui/material/Grid2";
import { d } from "@/utils/dictionary";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import {
  DefaultValues,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";
import { ZodSchema } from "zod";
import { FormProvider } from "react-hook-form";
import { RotateCcw, ShieldAlert } from "lucide-react";

type FormProps<T extends FieldValues> = {
  children: ReactNode;
  schema: ZodSchema<T>;
  title?: string;
  onSubmit: SubmitHandler<T>;
  onError?: SubmitErrorHandler<T>;
  slotProps?: {
    submitButtonProps?: ButtonProps;
    resetButtonProps?: Partial<IconButtonProps>;
    formContainerProps?: Partial<typeof Grid>;
  };
  showResetButton?: boolean;
  mode?: UseFormProps<T>["mode"];
  submitButtonText?: string;
  values?: Partial<T>;
  defaultValues?: Partial<T>;
  readOnly?: boolean;
};

const Form = <T extends FieldValues>({
  children,
  schema,
  title,
  onSubmit,
  onError,
  slotProps,
  showResetButton = true,
  mode = "all",
  values,
  defaultValues,
  submitButtonText,
  readOnly = false,
}: FormProps<T>) => {
  const form = useForm<T>({
    mode,
    defaultValues: defaultValues as DefaultValues<T>,
    values: values as T,
    resolver: zodResolver(schema),
  });


  const handleResetFormClick = async () => {
  };

  const extendedForm = {
    ...form,
    readOnly,
  };

  return (
    <FormProvider {...extendedForm}>
      <Grid
        container
        spacing={2}
        component="form"
        onSubmit={form.handleSubmit(onSubmit, onError)}
        {...slotProps?.formContainerProps}
      >
        {title && (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            size={{ xs: 12 }}
          >
            <Typography variant="h6">{title}</Typography>
            {showResetButton && !readOnly && (
              <IconButton
                onClick={handleResetFormClick}
                color="inherit"
                {...slotProps?.resetButtonProps}
              >
                <RotateCcw />
              </IconButton>
            )}
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <ShieldAlert />
        </Grid>

        {children}

        {!readOnly && (
          <Grid offset="auto">
            <Button
              type="submit"
              variant="contained"
              {...slotProps?.submitButtonProps}
            >
              {submitButtonText ??
                slotProps?.submitButtonProps?.children ??
                d.submit}
            </Button>
          </Grid>
        )}
      </Grid>
    </FormProvider>
  );
};

export { Form };
