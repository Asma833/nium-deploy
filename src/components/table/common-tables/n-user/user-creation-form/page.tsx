import React from 'react';
import UserCreationFormPage from './UserCreationFormPage';
import TableTabsLayout from '@/features/admin/components/table/TableTabsLayout';
import { userTabs } from '@/features/admin/config/table-tabs-nav.config';
import { userFormConfig } from './user-form.config';
import { userSchema } from './user-form.schema';

interface UserCreationProps {
  role?: string;
  tabs?: any[];
  formConfig?: any;
  schema?: any;
  title?: string;
}

export const UserCreation: React.FC<UserCreationProps> = ({
  role = 'User',
  tabs = userTabs,
  formConfig = userFormConfig,
  schema = userSchema,
  title,
}) => {
  return (
    <TableTabsLayout tabs={tabs}>
      <UserCreationFormPage formConfig={formConfig} schema={schema} role={role} title={title ?? ''} />
    </TableTabsLayout>
  );
};

export default UserCreation;
