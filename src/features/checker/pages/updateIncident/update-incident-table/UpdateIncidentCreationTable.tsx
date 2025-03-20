import { DynamicTable } from "@/components/common/dynamic-table/DynamicTable";
import { getTransactionTableColumns } from "./update-incident-creation-table-col";
import { transactionTableData as initialData, transactionTableData } from "./update-incident-table-value";
import { useEffect, useState } from "react";
import { DialogWrapper } from "@/components/common/DialogWrapper";
import UpdateIncidentForm from "../incident-form/UpdateIncidentForm";
import { useDynamicPagination } from "@/components/common/dynamic-table/hooks/useDynamicPagination";
import { useFilterApi } from "@/components/common/dynamic-table/hooks/useFilterApi";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useGetUpdateIncident } from "../../../hooks/useGetUpdate";
import { useCurrentUser } from "@/utils/getUserFromRedux";

const UpdateIncidentCreationTable = () => {
  // const [tableData,setTableData] = useState(initialData);
  const { setTitle } = usePageTitle();
  const { getUserHashedKey } = useCurrentUser();
  const currentUserHashedKey = getUserHashedKey();

  useEffect(() => {
    setTitle("Update Incident");
  }, [setTitle]);


  const requestData = {
    checkerId: currentUserHashedKey || "", 
    transaction_type: "all",
  };


  // Fetch data using the updated hook
  const { data, isLoading, error } = useGetUpdateIncident(requestData);
  console.log('data:', data)

  //const [selectedNiumId, setSelectedNiumId] = useState<string | null>(null);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isTableFilterDynamic = false;
  const isPaginationDynamic = false;

  // Use the dynamic pagination hook
  const pagination = useDynamicPagination({
    //  endpoint: API.CHECKER.UPDATE_INCIDENT.SEARCH_FILTER,
    endpoint: "",
    initialPageSize: 10,
    initialData,
    dataPath: "transactions",
    totalRecordsPath: "totalRecords",
  });

  const openModal = (niumId: string) => {
    const selectedRow = transactionTableData.find(item => item.nium_order_id === niumId);
    setSelectedRowData(selectedRow);
    setIsModalOpen(true);
  };

  const filterApi = useFilterApi({
    endpoint: "",
    // endpoint: API.CHECKER.UPDATE_INCIDENT.SEARCH_FILTER,
    initialData,
    // base query params if needed
    baseQueryParams: {
      // For example: clientId: '123'
    },
  });
  // useEffect(() => {
  //   setIsModalOpen(true)
  // }, []);

  const handleOnClick = (niumId: string) => {
    // Define what should happen when a row is clicked
    console.log(`Row with niumId ${niumId} clicked`);
  };
  const handleUnassign = () =>{
    
  }

  const columns = getTransactionTableColumns(openModal,handleUnassign);

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="mb-4 flex items-center">
          {(filterApi.loading || pagination.loading || isLoading) && (
            <span className="text-blue-500">Loading data...</span>
          )}
          {(filterApi.error || pagination.error || error) && (
            <span className="text-red-500">Error loading data</span>
          )}
        </div>

        <DynamicTable
          columns={columns}
          // data={transactionTableData}
          data={data && data.orders.length > 0 ? data.orders : []}
          tableWrapperClass="bg-background p-5 rounded-md"
          defaultSortColumn="nium_order_id"
          defaultSortDirection="asc"
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

        {isModalOpen && (
          <DialogWrapper
            triggerBtnText=""
            title="Update Incident"
            footerBtnText=""
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            description={selectedRowData?.nium_order_id ?? ""}
            renderContent={
              <UpdateIncidentForm 
                formActionRight="view" 
                rowData={selectedRowData}
              />
            }
          />
        )}
      </div>
    </div>
  );
};

export default UpdateIncidentCreationTable;
