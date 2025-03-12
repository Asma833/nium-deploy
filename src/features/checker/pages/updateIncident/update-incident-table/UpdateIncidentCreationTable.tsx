
import { DynamicTable } from "@/components/common/dynamic-table/DynamicTable";
import { getTransactionTableColumns } from "./update-incident-creation-table-col";
import { transactionTableData as initialData } from "./update-incident-table-value";
import {  useState } from "react";

import { DialogWrapper } from "@/components/common/DialogWrapper";
import UpdateIncidentForm from "../incident-form/UpdateIncidentForm";
import { useDynamicPagination } from "@/components/common/dynamic-table/hooks/useDynamicPagination";
import { API } from "@/core/constant/apis";
import { useFilterApi } from "@/components/common/dynamic-table/hooks/useFilterApi";




const UpdateIncidentCreationTable = () => {
  const [tableData] = useState(initialData);

  const [selectedNiumId, setSelectedNiumId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 // const formRef = useRef<() => void | null>(null); // Ref for triggering form submission

   const isTableFilterDynamic = false;
   const isPaginationDynamic = false;
 
   // Use the dynamic pagination hook
   const pagination = useDynamicPagination({
     endpoint: API.CHECKER.UPDATE_INCIDENT.SEARCH_FILTER,
     initialPageSize: 10,
     initialData,
     dataPath: "transactions",
     totalRecordsPath: "totalRecords",
   });
  const openModal = (value: string) => {
    setSelectedNiumId(value);
    setIsModalOpen(true);
  };
   const filterApi = useFilterApi({
      endpoint: API.CHECKER.UPDATE_INCIDENT.SEARCH_FILTER,
      initialData,
      // base query params if needed
      baseQueryParams: {
        // For example: clientId: '123'
      },
    });

  const columns = getTransactionTableColumns(openModal);

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
   
      <DynamicTable
        columns={columns}
        data={tableData}
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="niumId"
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
          description={selectedNiumId ?? ""}
          renderContent={
            // <UpdateIncidentForm onSubmit={() => {
            //   if (formRef.current) formRef.current();
            // }} />
            <UpdateIncidentForm />
          }
         
        />
      )}
       </div>
    </div>
  );
};

export default UpdateIncidentCreationTable;
