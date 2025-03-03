import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentSchema } from "../agent-branch-form/agent-registration-form.schema";
import { agentFormConfig } from "../agent-branch-form/agent-registration-config";
import { FormProvider } from "@/components/form/context/FormProvider";
import { getController } from "@/components/form/utils/getController";
import FormFieldRow from "@/components/form/wrapper/FormFieldRow";
import FieldWrapper from "@/components/form/wrapper/FieldWrapper";

import Spacer from "@/components/form/wrapper/Spacer";
import { FormContentWrapper } from "@/components/form/wrapper/FormContentWrapper";

const AgentRegistrationForm = () => {
  const methods = useForm({
    resolver: zodResolver(agentSchema),
    defaultValues: Object.fromEntries(
      Object.keys(agentFormConfig.fields).map((key) => [key, ""])
    ),
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    // const subscription = watch();
    // return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: any) => {
    console.log("Submitted Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <FormProvider methods={methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white shadow-md rounded-lg max-w-full mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">
          {agentFormConfig.sectionTitle}
        </h2>

        <FormContentWrapper>
          <Spacer>
          <FormFieldRow rowCols={4} >
            {Object.entries(agentFormConfig.fields).map(([name, field]) => (
                <FieldWrapper>
                  {getController({ ...field, name, control, errors})}
                </FieldWrapper>
            ))}
             </FormFieldRow>
          </Spacer>
        </FormContentWrapper>

        <div className="flex justify-end space-x-2 mt-6">
          <button type="reset" className="border px-4 py-2 rounded-md">
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AgentRegistrationForm;
