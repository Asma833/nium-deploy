import { getController } from '@/components/form/utils/getController';
import FieldWrapper from '@/components/form/wrapper/FieldWrapper';
import { FormContentWrapper } from '@/components/form/wrapper/FormContentWrapper';
import FormFieldRow from '@/components/form/wrapper/FormFieldRow';
import Spacer from '@/components/form/wrapper/Spacer';
import { charges } from '../config/agent-profile-form-config';

const ChargesStep = () => {
  return (
    <FormContentWrapper>
      <Spacer>
        <FormFieldRow rowCols={4} groupName="Bank Details">
          {Object.values(charges.commissionType).map((field, index) => {
            return (
              <FieldWrapper key={index}>{getController(field)}</FieldWrapper>
            );
          })}
        </FormFieldRow>
      </Spacer>
      <button type="submit">Submit</button>
    </FormContentWrapper>
  );
};

export default ChargesStep;
