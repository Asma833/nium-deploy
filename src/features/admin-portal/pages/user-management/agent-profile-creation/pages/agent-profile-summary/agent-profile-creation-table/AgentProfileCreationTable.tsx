import { DynamicTable } from "@/components/common/DynamicTable";
import { getAgentProfileCreationColumn } from "./agent-profile-creation-table-col";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgentProfileCreationTable = () => {
  const navigate = useNavigate();
  const columns = getAgentProfileCreationColumn();

  const handleCreateUser = () => {
    navigate("create-new-agent");
  };

  return (
    <div className="">
      <DynamicTable
        columns={columns}
        data={[]}
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="agentCode"
        renderLeftSideActions={() => (
          <Button onClick={handleCreateUser} className="bg-primary text-white">
            {" "}
            <PlusIcon /> Create Agent Profile
          </Button>
        )}
        filter={{
          filterOption: true,
          dateFilterColumn: "requestRaiseDate",
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

export default AgentProfileCreationTable;
