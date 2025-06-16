import { userFormConfig } from '@/components/table/common-tables/n-user/user-creation-form/user-form.config';
import { userSchema } from '@/components/table/common-tables/n-user/user-creation-form/user-form.schema';
import UserCreationFormPage from '@/components/table/common-tables/n-user/user-creation-form/UserCreationFormPage';
import TableTabsLayout from '@/features/admin/components/table/TableTabsLayout';
import { userTabs } from '@/features/admin/config/table-tabs-nav.config';

const CheckerCreationPage = () => {
  return (
    <TableTabsLayout tabs={userTabs}>
      <UserCreationFormPage formConfig={userFormConfig} schema={userSchema} role="checker" title="Create Checker" />
    </TableTabsLayout>
  );
};

export default CheckerCreationPage;
