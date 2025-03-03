import { DynamicTable } from "@/components/common/DynamicTable";
import { getTransactionTableColumns } from "./update-incident-creation-table-col";
import { transactionTableData as initialData } from "./update-incident-table-value";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogWrapper } from "@/components/common/DialogWrapper";

const UpdateIncidentCreationTable = () => {
  const [tableData] = useState(initialData);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedNiumId, setSelectedNiumId] = useState<string | null>(null);

  const openModal = (value: string) => {
    setSelectedNiumId(value);
  };

  const columns = getTransactionTableColumns(openModal); 

  return (
    <div className="">
      <DynamicTable
        columns={columns}
        data={tableData}
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
        renderLeftSideActions={() => (
          <div className="flex flex-wrap lg:flex-nowrap items-center space-x-0 lg:space-x-4">
            <div className="flex flex-col w-full mb-4 md:w-auto lg:mb-0">
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="From Date"
                className="px-2 py-2 rounded-md bg-gray-200"
              />
            </div>
            <div className="flex flex-col w-full mb-4 md:w-auto lg:mb-0">
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="To Date"
                className="px-2 py-2 rounded-md bg-gray-200"
              />
            </div>
            <Button className="bg-primary text-white mb-3 lg:mb-0">
              Apply
            </Button>
          </div>
        )}
        filter={{
          filterOption: true,
          dateFilterColumn: "orderDate",
          statusFilerColumn: "status",
          roleFilerColumn: "role",
          rederFilerOptions: {
            search: true,
          },
        }}
      />
      {selectedNiumId && (
        <DialogWrapper
          triggerBtnText="Open Modal"
          title="Nium ID Details"
          showFooter={true} // Ensure footer is visible
          showHeader={true}
          isLoading={false}
          renderContent={<div>Nium ID: {selectedNiumId}</div>}
          onSave={() => setSelectedNiumId(null)}
        >
        </DialogWrapper>
      )}
    </div>
  );
};

export default UpdateIncidentCreationTable;