import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import Spacer from '@/components/form/wrapper/Spacer';
import { adminDetails } from '../config/agent-profile-form-config';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import { getController } from '@/components/form/utils/getController';
import CheckboxWrapper from '@/components/form/wrapper/CheckboxWrapper';

const AdminDetailsStep = () => {
  return (
    <FormContentWrapper>
      <Spacer>
        <FormFieldRow rowCols={4} groupName="Agent Admin Details">
          {Object.values(adminDetails.basicDetails)
            .slice(0, 2)
            .map((field, index) => {
              return (
                <FieldWrapper key={index}>{getController(field)}</FieldWrapper>
              );
            })}
        </FormFieldRow>
        <FormFieldRow rowCols={4}>
          {Object.values(adminDetails.basicDetails)
            .slice(2, 3)
            .map((field, index) => {
              return (
                <CheckboxWrapper
                  className="flex-col items-start items-direction-row"
                  key={index}
                >
                  {getController(field)}
                </CheckboxWrapper>
              );
            })}
        </FormFieldRow>
        <FormFieldRow rowCols={4}>
          {Object.values(adminDetails?.agentAdminDetails)
            .slice(0, 4)
            .map((field, index) => {
              if (!adminDetails.agentAdminDetails) {
                return;
              }
              return (
                <FieldWrapper key={index}>{getController(field)}</FieldWrapper>
              );
            })}
        </FormFieldRow>
        <FormFieldRow rowCols={4}>
          {Object.values(adminDetails?.agentAdminDetails)
            .slice(0, 4)
            .map((field, index) => {
              if (!adminDetails.agentAdminDetails) {
                return;
              }
              return (
                <FieldWrapper key={index}>{getController(field)}</FieldWrapper>
              );
            })}
        </FormFieldRow>
        <FormFieldRow rowCols={4}>
          {Object.values(adminDetails?.agentAdminDetails)
            .slice(4, 6)
            .map((field, index) => {
              if (!adminDetails.agentAdminDetails) {
                return;
              }
              return (
                <FieldWrapper>
                  <CheckboxWrapper
                    className="flex-col items-start items-direction-row"
                    key={index}
                  >
                    {getController(field)}
                  </CheckboxWrapper>
                </FieldWrapper>
              );
            })}
        </FormFieldRow>
      </Spacer>
    </FormContentWrapper>
  );
};

export default AdminDetailsStep;
