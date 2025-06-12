import React from 'react';
import UserCreationFormPage from './UserCreationFormPage';
import TableTabsLayout from '@/features/admin/components/table/TableTabsLayout';
import { userTabs } from '@/features/admin/config/table-tabs-nav.config';

export const UserCreation: React.FC = () => {
  return (
    <TableTabsLayout tabs={userTabs}>
      <UserCreationFormPage />
    </TableTabsLayout>
  );
};

export default UserCreation;
