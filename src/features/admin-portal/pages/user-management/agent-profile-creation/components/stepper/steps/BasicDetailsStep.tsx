import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormContentWrapper } from "@/components/form/wrapper/FormContentWrapper";
import { basicDetails, validationSchema } from "./form-metadata";
import FormFieldRow from "@/components/form/wrapper/FormFieldRow";
import FieldWrapper from "@/components/form/wrapper/FieldWrapper";
import { getController } from "@/components/form/utils/getController";
import Spacer from "@/components/form/wrapper/Spacer";

interface FormValues {
  [key: string]: string;
}

export const BasicDetailsStep: React.FC = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: Object.keys(basicDetails).reduce<FormValues>(
      (values, key) => {
        values[key] = "";
        return values;
      },
      {}
    ),
  });

  return (
    <FormContentWrapper>
      <form onSubmit={handleSubmit((values) => console.log(values))}>
        <Spacer>
          <FormFieldRow rowCols={4}>
            {Object.values(basicDetails)
              .slice(0, 7)
              .map((field, index) => {
                return (
                  <FieldWrapper key={index}>
                    {getController(field)}
                  </FieldWrapper>
                );
              })}
          </FormFieldRow>
          <FormFieldRow rowCols={4}>
            {Object.values(basicDetails)
              .slice(7, 8)
              .map((field, index) => {
                return (
                  <FieldWrapper key={index}>
                    {getController(field)}
                  </FieldWrapper>
                );
              })}
          </FormFieldRow>
        </Spacer>
        <button type="submit">Submit</button>
      </form>
    </FormContentWrapper>
  );
};
