import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetData } from '@/hooks/useGetData';
import { API } from '@/core/constant/apis';
import { queryKeys } from '@/core/constant/queryKeys';
import { User } from '@/features/auth/types/auth.types';
import NuserCreationTable from '@/components/table/common-tables/n-user/n-user-table/UserCreationTable';
import TableTabsLayout from '../../components/table/TableTabsLayout';
import { userTabs } from '../../config/table-tabs-nav.config';

const CheckerTablePage = () => {
  // Fetch user data
  const {
    data,
    isLoading: userLoading,
    error: userError,
  } = useGetData<User[]>({
    endpoint: API.NUSERS.USER.LIST,
    queryKey: queryKeys.user.allUsers,
    dataPath: '',
  });

  // Transform and filter data
  const users = React.useMemo(() => {
    if (!data) return [];

    const normalizedData =
      typeof data === 'object' && !Array.isArray(data)
        ? (Object.values(data) as Record<string, any>[])
        : Array.isArray(data)
          ? (data as Record<string, any>[])
          : [];

    return normalizedData.filter((user) => user?.role?.name?.toLowerCase() === 'checker');
  }, [data]);

  return (
    <TableTabsLayout tabs={userTabs}>
      <NuserCreationTable role="checker" userData={users} userLoading={false} userError={false} disableColumns={[]} />
    </TableTabsLayout>
  );
};

export default CheckerTablePage;
