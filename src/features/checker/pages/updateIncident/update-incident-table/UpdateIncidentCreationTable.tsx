import { DynamicTable } from "@/components/common/dynamic-table/DynamicTable";
import { getTransactionTableColumns } from "./update-incident-creation-table-col";
import {
  transactionTableData as initialData,
  transactionTableData,
} from "./update-incident-table-value";
import { useEffect, useState } from "react";
import { DialogWrapper } from "@/components/common/DialogWrapper";
// import { UpdateIncidentForm } from "../incident-form/UpdateIncidentForm";
import { useDynamicPagination } from "@/components/common/dynamic-table/hooks/useDynamicPagination";
import { useFilterApi } from "@/components/common/dynamic-table/hooks/useFilterApi";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useGetUpdateIncident } from "../../../hooks/useGetUpdate";
import { useCurrentUser } from "@/utils/getUserFromRedux";
import UpdateIncidentForm from "../incident-form/UpdateIncidentForm";
import useUnassignChecker from "@/features/checker/hooks/useUnassignChecker";

interface RowData {
  nium_order_id: string;
  [key: string]: any;
}

const UpdateIncidentCreationTable = () => {
  // const [tableData,setTableData] = useState(initialData);
  const { setTitle } = usePageTitle();
  const { getUserHashedKey } = useCurrentUser();
  const currentUserHashedKey = getUserHashedKey();

  // Call the hook at the top level of the component
  const { handleUnassign: unassignChecker, isPending: isUnassignPending } =
    useUnassignChecker();

  useEffect(() => {
    setTitle("Update Incident");
  }, [setTitle]);

  // const user = JSON.parse(localStorage.getItem("user") || "");
  // const requestData = {
  //   checkerId: user.hashed_key,
  //   transaction_type: "all",
  // };
  const requestData = {
    checkerId: currentUserHashedKey || "",
    transaction_type: "all",
  };

  // Fetch data using the updated hook
  const { data, isLoading, error } = useGetUpdateIncident(requestData);
  console.log("data:", data);

  //const [selectedNiumId, setSelectedNiumId] = useState<string | null>(null);
  // const [selectedNiumId, setSelectedNiumId] = useState<string | null>(null);
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

  const openModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const filterApi = useFilterApi({
    endpoint: "",
    initialData,
    baseQueryParams: {},
  });

  const handleUnassign = (rowData: RowData): void => {
    if (currentUserHashedKey) {
      unassignChecker(rowData.partner_order_id, currentUserHashedKey);
    }
  };
  const handleCopyLink = (rowData: RowData): void => {
    const e_sign_link = rowData.e_sign_link;
  };
  const columns = getTransactionTableColumns(
    openModal,
    handleUnassign,
    handleCopyLink
  );

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
                setIsModalOpen={setIsModalOpen}
              />
            }
          />
        )}
      </div>
    </div>
  );
};

export default UpdateIncidentCreationTable;
