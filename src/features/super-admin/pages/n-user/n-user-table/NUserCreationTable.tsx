import { DynamicTable } from "@/components/common/dynamic-table/DynamicTable";
import { getUserTableColumns } from "./n-user-creation-table-col";
import { userTableData as initialData} from "./user-table-value";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFilterApi } from "@/components/common/dynamic-table/hooks/useFilterApi";
import { API } from "@/core/constant/apis";
import { useDynamicPagination } from "@/components/common/dynamic-table/hooks/useDynamicPagination";
import { usePageTitle } from "@/components/common/PageTitle";

const NuserCreationTable = () => {
  const navigate = useNavigate();
   const { setTitle } = usePageTitle();
    useEffect(() => {
      setTitle("N-Users");
    }, [setTitle]);
  const [tableData, setTableData] = useState(initialData);
  
  // const handleStatusChange = (rowIndex: number, checked: boolean) => {
  //   setTableData((prevData) =>
  //     prevData.map((row, idx) =>
  //       idx === rowIndex ? { ...row, status: checked } : row
  //     )
  //   );
  // };
  const handleStatusChange = (rowIndex: number, checked: boolean) => {
    setTableData((prevData) => {
      const newData = prevData.map((row, idx) =>
        idx === rowIndex ? { ...row, status: checked } : row
      );
      console.log("Updated Data:", newData); // ✅ Debug: Ensure the new state is correct
      return [...newData]; // ✅ Return a new array to trigger re-render
    });
  };
  
  
  
  
     const isTableFilterDynamic = false;
     const isPaginationDynamic = false;
   
     // Use the dynamic pagination hook
     const pagination = useDynamicPagination({
       endpoint: API.NUSERS.SEARCH_FILTER,
       initialPageSize: 10,
       initialData,
       dataPath: "transactions",
       totalRecordsPath: "totalRecords",
     });
  
  const handleCreateUser = () => {
    navigate("create-user");
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
const filterApi = useFilterApi({
      endpoint: API.NUSERS.SEARCH_FILTER,
      initialData,
      // base query params if needed
      baseQueryParams: {
        // For example: clientId: '123'
      },
    });
  const columns = getUserTableColumns(handleStatusChange,handleNavigate);

  return (
    <div className="">
       <div className="flex flex-col">
    <div className="mb-4 flex items-center">
      {(filterApi.loading || pagination.loading) && (
        <span className="text-blue-500">Loading data...</span>
      )}
      {(filterApi.error || pagination.error) && (
        <span className="text-red-500">Error loading data</span>
      )}
    </div>
    </div>
      <DynamicTable
        columns={columns}
        data={tableData}
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
       renderLeftSideActions={() => (
          <Button onClick={handleCreateUser} className="bg-primary text-white px-4">
            {" "}
            <PlusIcon /> Create User
          </Button>
       )}
       loading={pagination.loading}
       paginationMode={isPaginationDynamic ? "dynamic" : "static"}
       onPageChange={
         isPaginationDynamic
           ? pagination.handlePageChange
           : async (_page: number, _pageSize: number) => []
       }
       totalRecords={pagination.totalRecords}
       
        filter={{
          filterOption: true,
          mode: isTableFilterDynamic ? "dynamic" : "static",
          rederFilerOptions: {
            search: true,
          },
          // Dynamic callbacks - API functions
          dynamicCallbacks: isTableFilterDynamic
            ? {
                onSearch: filterApi.search,
              }
            : undefined,
        }}
      />
    </div>
  );
};

export default NuserCreationTable;
