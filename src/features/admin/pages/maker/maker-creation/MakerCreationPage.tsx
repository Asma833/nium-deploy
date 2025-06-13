import { userFormConfig } from '@/components/table/common-tables/n-user/user-creation-form/user-form.config';
import { userSchema } from '@/components/table/common-tables/n-user/user-creation-form/user-form.schema';
import UserCreationFormPage from '@/components/table/common-tables/n-user/user-creation-form/UserCreationFormPage';

const MakerCreationPage = () => {
  return <UserCreationFormPage formConfig={userFormConfig} schema={userSchema} role="Maker" title="Create Maker" />;
};

export default MakerCreationPage;
