import { DynamicTable } from "@/components/common/DynamicTable";
import { getUserTableColumns } from "./n-user-creation-table-col";
import { userTableData as initialData} from "./user-table-value";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
const NuserCreationTable = () => {
  const navigate = useNavigate();
  const handleStatusChange = (rowIndex: number, checked: boolean) => {
    console.log("Before update:", tableData); // ✅ Debugging log before update
    setTableData((prevData) =>
      prevData.map((row, idx) =>
        idx === rowIndex ? { ...row, status: checked ? "true" : "false" } : row
      )
    );
    console.log("After update:", tableData); // ✅ Debugging log after update
  };
  

const columns = getUserTableColumns(handleStatusChange);
const [tableData, setTableData] = useState(initialData);
const handleCreateUser = () => {
  navigate("create-user");
};

  return (
    <div className="">
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

export default NuserCreationTable;
