import { Alert, List, ListItem } from "@mui/material";
import { FieldValues } from "react-hook-form";
import { useFormContext } from "./context/form-context";

export const FormErrorSummary = () => {
  const { formState: { errors } } = useFormContext<FieldValues>();
  const errorMessages = Object.values(errors)
    .map((error) => error?.message as string)
    .filter(Boolean);

  if (errorMessages.length === 0) return null;

  return (
    <Alert severity="error">
      <List>
        {errorMessages.map((message, index) => (
          <ListItem key={index}>{message}</ListItem>
        ))}
      </List>
    </Alert>
  );
};
