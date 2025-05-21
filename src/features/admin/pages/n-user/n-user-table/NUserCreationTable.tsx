import { useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { GetUserTableColumns } from './NUserCreationTableColumns';
import { Button } from '@/components/ui/button';
import { useFilterApi } from '@/components/common/dynamic-table/hooks/useFilterApi';
import { API } from '@/core/constant/apis';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useUpdateStatusAPI } from '@/features/admin/hooks/useUserUpdateStatus';
import { useGetData } from '@/hooks/useGetData';
import { User } from '@/features/auth/types/auth.types';
import { queryKeys } from '@/core/constant/queryKeys';
import { cn } from '@/utils/cn';

const NuserCreationTable = () => {
  const navigate = useNavigate();
  usePageTitle('N-Users');

  const { data, isLoading: loading } = useGetData<User[]>({
    endpoint: API.NUSERS.USER.LIST,
    queryKey: queryKeys.user.allUsers,
    dataPath: '',
  });
  const users = data || [];

  const { mutate: updateStatus } = useUpdateStatusAPI();

  const handleStatusChange = async (rowData: any, checked: boolean) => {
    if (!rowData || !rowData.id) {
      return;
    }
    // Make the API call to update the status
    await updateStatus({
      hashed_key: rowData.id,
      is_active: checked,
    });
  };

  const handleCreateUser = () => {
    navigate('create-user');
  };

  const handleNavigate = (path: string, rowData: string) => {
    navigate(path, { state: { selectedRow: rowData } });
  };
  const filterApi = useFilterApi({
    endpoint: API.NUSERS.USER.LIST,
    // base query params if needed
    baseQueryParams: {
      // For example: clientId: '123'
    },
  });
  const columns = GetUserTableColumns(handleStatusChange, handleNavigate);

  return (
    <div className="dynamic-table-wrap">
      <div className="flex flex-col">
        <div
          className={cn(
            'mb-4 flex items-center',
            !filterApi.loading ? 'hidden' : '',
            !filterApi.error ? 'hidden' : ''
          )}
        >
          {filterApi.loading && (
            <span className="text-blue-500">Loading data...</span>
          )}
          {filterApi.error && (
            <span className="text-red-500">Error loading data</span>
          )}
        </div>
      </div>
      <DynamicTable
        columns={columns}
        data={users || []}
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
        renderLeftSideActions={() => (
          <Button
            onClick={handleCreateUser}
            className="bg-primary text-white px-4"
          >
            {' '}
            <PlusIcon /> Create User
          </Button>
        )}
        loading={loading}
        totalRecords={users?.length || 0}
        filter={{
          filterOption: true,
          mode: 'static',
          renderFilterOptions: {
            search: true,
          },
        }}
      />
    </div>
  );
};

export default NuserCreationTable;
