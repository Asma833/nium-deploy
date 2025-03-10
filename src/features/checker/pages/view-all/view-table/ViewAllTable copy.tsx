import { DynamicTable } from "@/components/common/DynamicTable";
import { getTransactionTableColumns } from "./view-all-table-col";
import { transactionTableData as initialData } from "./view-all-table-value";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ViewAllTable = () => {
  const columns = getTransactionTableColumns();
  const [tableData] = useState(initialData);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [purposeType, setPurposeType] = useState("");

  return (
    <div className="">
      <DynamicTable
        columns={columns}
        data={tableData}
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
        renderLeftSideActions={() => (
          <div className="flex flex-wrap 2xl:flex-nowrap items-center">
            <div className="flex flex-col w-full mb-4 md:w-auto lg:mb-2 lg:mr-4">
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="From Date"
                className="px-2 py-2 rounded-md bg-gray-200"
              />
            </div>
            <div className="flex flex-col w-full mb-4 md:w-auto lg:mb-2 lg:mr-4">
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="To Date"
                className="px-2 py-2 rounded-md bg-gray-200"
              />
            </div>
            <div className="flex flex-col w-full mb-4 md:w-auto lg:mb-2 lg:mr-4">
              <select
                id="transactionType"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="px-2 py-2 rounded-md bg-gray-200 h-10"
              >
                <option value="">Select Transaction Type</option>
                <option value="Card Load VKYC + ESign">Card Load VKYC + ESign</option>
                <option value="Card Reload ESign">Card Reload ESign</option>
                <option value="Encashment ESign">Encashment ESign</option>
                <option value="Remittance VKYC + ESign">Remittance VKYC + ESign</option>
              </select>
            </div>
            <div className="flex flex-col w-full mb-4 md:w-auto lg:mb-2 lg:mr-4">
              <select
                id="purposeType"
                value={purposeType}
                onChange={(e) => setPurposeType(e.target.value)}
                className="px-2 py-2 rounded-md bg-gray-200 h-10"
              >
                <option value="">Select Purpose Type</option>
                <option value="BTQ">BTQ</option>
                <option value="BT">BT</option>
                <option value="University Fee - Self Funded">University Fee - Self Funded</option>
              </select>
            </div>
            <Button className="bg-primary text-white mb-3 lg:mb-2">
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
    </div>
  );
};

export default ViewAllTable;