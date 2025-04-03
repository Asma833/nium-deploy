
import { DynamicTable } from "@/components/common/dynamic-table/DynamicTable";
import { getAgentBranchUserColumn } from "./agent-branch-user-table-col";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
const AgentBranchUserTable = () => {
  const columns = getAgentBranchUserColumn();
  const navigate = useNavigate();
  const handleCreateUser = () => {
    navigate("/admin/user-management/agent-branch-user-registration");
  };

  return (
    <div className="">
      <DynamicTable
        columns={columns}
        data={[]}
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="requestId"
        renderLeftSideActions={() => (
          <Button 
            onClick={handleCreateUser}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Create Agent Branch User
          </Button>
        )}
        filter={{
          filterOption: true,
          dateFilterColumn: "requestRaiseDate",
          statusFilerColumn: "status",
          roleFilerColumn: "role",
          renderFilterOptions: {
            search: true,
          },
        }}
      />
    </div>
  );
};

export default AgentBranchUserTable;