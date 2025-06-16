import { userFormConfig } from '@/components/table/common-tables/n-user/user-creation-form/user-form.config';
import { userSchema } from '@/components/table/common-tables/n-user/user-creation-form/user-form.schema';
import UserCreationFormPage from '@/components/table/common-tables/n-user/user-creation-form/UserCreationFormPage';
import TableTabsLayout from '@/features/admin/components/table/TableTabsLayout';
import { makerTabs } from '@/features/admin/config/table-tabs-nav.config';

const MakerCreationPage = () => {
  return (
    <TableTabsLayout tabs={makerTabs}>
      <UserCreationFormPage formConfig={userFormConfig} schema={userSchema} role="maker" title="Create Maker" />
    </TableTabsLayout>
  );
};

export default MakerCreationPage;
