import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardContentWrapper from '@/components/common/DashboardContentWrapper';

import { Button } from '@/components/ui/button';
import { PlusCircle, Download } from 'lucide-react';
import { useGetData } from '@/hooks/useGetData';
import { API } from '@/core/constant/apis';
import { queryKeys } from '@/core/constant/queryKeys';
import { User } from '@/features/auth/types/auth.types';
import NuserCreationTable from '@/components/table/common-tables/n-user/n-user-table/NUserCreationTable';
import { exportToCSV } from '@/utils/exportUtils';
import TableTabsLayout from '../../components/table/TableTabsLayout';
import { makerTabs, userTabs } from '../../config/table-tabs-nav.config';

const MakerTablePage = () => {
  const navigate = useNavigate();

  // Fetch user data
  const {
    data,
    isLoading: userLoading,
    error: userError
  } = useGetData<User[]>({
    endpoint: API.NUSERS.USER.LIST,
    queryKey: queryKeys.user.allUsers,
    dataPath: '',
  });

  // Transform data if needed
  const users = React.useMemo(() => {
    if (!data) return [];

    return data && typeof data === 'object' && !Array.isArray(data)
      ? (Object.values(data) as Record<string, any>[])
      : Array.isArray(data)
        ? (data as Record<string, any>[])
        : [];
  }, [data]);

  const handleAddNewUser = () => {
    navigate('/admin/makers/create');
  };


  return (
     <TableTabsLayout tabs={makerTabs}>
    <NuserCreationTable
      userData={users}
      userLoading={userLoading}
      userError={!!userError}
     
      disableColumns={[]}
    />
    </TableTabsLayout>
  );
};

export default MakerTablePage;
