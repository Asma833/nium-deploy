import { DynamicTable } from "@/components/common/DynamicTable";
import { getTransactionTableColumns } from "./assign-creation-table-col";
import { transactionTableData as initialData} from "./assign-table-value";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const AssignCreationTable = () => {
  const [tableData, setTableData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const handleSelectChange = (rowIndex: number, checked: boolean) => {
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
      <div className="flex justify-center">
      <Button
        type="submit"
        disabled={isLoading}
        className="w-fit"
        onClick={() => {
          setIsLoading(true);
          // Simulate an async action
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        }}
      >
     {isLoading ? (
       <>
         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
       </>
     ) : (
       "Take Request"
     )}
   </Button>
      </div>
      
    </div>
  
     
  
  );
};

export default AssignCreationTable;
