import { DynamicTable } from "@/components/common/dynamic-table/DynamicTable";
import { getTransactionTableColumns } from "./update-incident-creation-table-col";
import {
  transactionTableData as initialData,
  transactionTableData,
} from "./update-incident-table-value";
import { useEffect, useState } from "react";
import { DialogWrapper } from "@/components/common/DialogWrapper";
import { useDynamicPagination } from "@/components/common/dynamic-table/hooks/useDynamicPagination";
import { useFilterApi } from "@/components/common/dynamic-table/hooks/useFilterApi";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useGetUpdateIncident } from "../../../hooks/useGetUpdate";
import { useCurrentUser } from "@/utils/getUserFromRedux";
import UpdateIncidentForm from "../incident-form/UpdateIncidentForm";
import useUnassignChecker from "@/features/checker/hooks/useUnassignChecker";
import { useSendEsignLink} from "@/features/checker/hooks/useSendEsignLink";

interface RowData {
  nium_order_id: string;
  [key: string]: any;
}

const UpdateIncidentCreationTable = () => {
  const { setTitle } = usePageTitle();
  const { getUserHashedKey } = useCurrentUser();
  const currentUserHashedKey = getUserHashedKey();

  // Call the hook at the top level of the component
  const { handleUnassign: unassignChecker, isPending: isUnassignPending } =
    useUnassignChecker();
  const { mutate: sendEsignLink, isSendEsignLinkLoading } =  useSendEsignLink();
 
   useEffect(() => {
    setTitle("Update Incident");
  }, [setTitle]);

  const requestData = {
    checkerId: currentUserHashedKey || "",
    transaction_type: "all",
  };

  // Fetch data using the updated hook
  const { data, isLoading, error } = useGetUpdateIncident(requestData);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isTableFilterDynamic = false;
  const isPaginationDynamic = false;

  // Use the dynamic pagination hook
  const pagination = useDynamicPagination({
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
  const handleRegenerateEsignLink = (rowData: RowData): void => {
    sendEsignLink({partner_order_id:rowData.partner_order_id});
    // console.log("Regenerate Esign Link", rowData);
  }
  const columns = getTransactionTableColumns(openModal,handleUnassign,handleRegenerateEsignLink, isSendEsignLinkLoading);

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
          data={data && data.orders.length > 0 ? data.orders : []}
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
            dateFilterColumn: "createdAt",
            mode: isTableFilterDynamic ? "dynamic" : "static",
            renderFilterOptions: {
              search: true,
              dateRange: true,
              applyAction: true,
              resetAction: true
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
