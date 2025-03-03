import { DynamicTable } from "@/components/common/DynamicTable";
import { getTransactionTableColumns } from "./assign-creation-table-col";
import { transactionTableData as initialData} from "./assign-table-value";
import { useState } from "react";

const AssignCreationTable = () => {
  
  const [tableData, setTableData] = useState(initialData);
  const handleSelectChange = (rowIndex: number, checked: boolean) => {
   // console.log("Before update:", rowIndex, checked);
  
    setTableData((prevData) =>
      prevData.map((row, idx) =>
        idx === rowIndex ? { ...row, select: checked } : row
      )
    );
  };
  
  const columns = getTransactionTableColumns(handleSelectChange);
  

  return (
    <div className="">
      <DynamicTable
        columns={columns}
        data={tableData}
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
       // renderLeftSideActions={() => (
        //   <Button onClick={handleCreateUser} className="bg-primary text-white">
        //     {" "}
        //     <PlusIcon /> Create Agent Profile
        //   </Button>
       // )}
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

export default AssignCreationTable;
