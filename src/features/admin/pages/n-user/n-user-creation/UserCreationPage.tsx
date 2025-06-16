import { userFormConfig } from '@/components/table/common-tables/n-user/user-creation-form/user-form.config';
import { userSchema } from '@/components/table/common-tables/n-user/user-creation-form/user-form.schema';
import UserCreationFormPage from '@/components/table/common-tables/n-user/user-creation-form/UserCreationFormPage';

const CheckerCreationPage = () => {
  return (
     <UserCreationFormPage
      formConfig={userFormConfig}  
      schema={userSchema}         
      role="checker"                 
      title="Create Checker"
    />
  );
};

export default CheckerCreationPage;