import { useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { getUserTableColumns } from './n-user-creation-table-col';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useFilterApi } from '@/components/common/dynamic-table/hooks/useFilterApi';
import { API } from '@/core/constant/apis';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useUpdateStatusAPI } from '@/features/admin/hooks/useUserUpdateStatus';
import { useGetUserApi } from '@/features/admin/hooks/useGetUser';

const NuserCreationTable = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  useEffect(() => {
    setTitle('N-Users');
  }, [setTitle]);

  const {
    data: users = [],
    loading,
    error,
  } = useGetUserApi('NUSERS.USER.LIST');

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
  const columns = getUserTableColumns(handleStatusChange, handleNavigate);

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="mb-4 flex items-center">
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
        tableWrapperClass="bg-background p-5 rounded-md"
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
