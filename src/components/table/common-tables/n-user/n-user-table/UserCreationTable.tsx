import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { DynamicTable } from '@/components/common/dynamic-table/DynamicTable';
import { useFilterApi } from '@/components/common/dynamic-table/hooks/useFilterApi';
import { API } from '@/core/constant/apis';
import { useUpdateStatusAPI } from '@/features/admin/hooks/useUserUpdateStatus';
import { cn } from '@/utils/cn';
import { GetUserTableColumns } from './UserCreationTableColumns';

// Create an interface for the props
interface UserCreationTableProps {
  userData: any[];
  userLoading: boolean;
  userError: boolean;
  disableColumns?: string[];
  role: string;
  totalRecords?: number; // Added optional totalRecords prop
}

const UserCreationTable: React.FC<UserCreationTableProps> = ({
  userData,
  role,
  userLoading,
  disableColumns = [],
  totalRecords,
}) => {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState<any[]>([]);

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

  const handleNavigate = (path: string, rowData: string) => {
    navigate(path, { state: { selectedRow: rowData } });
  };

  const filterApi = useFilterApi({
    endpoint: API.NUSERS.USER.LIST,
    baseQueryParams: {},
  });

  const columns = GetUserTableColumns(handleStatusChange, handleNavigate, role);

  // Filter columns if disableColumns is provided
  const tableColumns = columns.filter((col) => !disableColumns?.includes(col.id as string));

  return (
    <div className="dynamic-table-wrap">
      <div className="flex flex-col">
        <div
          className={cn('mb-4 flex items-center', !filterApi.loading ? 'hidden' : '', !filterApi.error ? 'hidden' : '')}
        >
          {filterApi.loading && <span className="text-blue-500">Loading data...</span>}
          {filterApi.error && <span className="text-red-500">Error loading data</span>}
        </div>
      </div>{' '}
      <DynamicTable
        columns={tableColumns}
        data={userData || []}
        loading={userLoading || filterApi.loading}
        totalRecords={filteredData.length > 0 ? filteredData.length : totalRecords || userData?.length || 0}
        paginationMode={'static'}
        filter={{
          filterOption: true,
          mode: 'static',
          renderFilterOptions: {
            search: true
          },
        }}
        onFilteredDataChange={setFilteredData}
      />
    </div>
  );
};

export default UserCreationTable;
