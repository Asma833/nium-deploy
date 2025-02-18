import { DynamicTable } from "@/components/common/DynamicTable";
import { getAgentProfileCreationColumn } from "./agent-profile-creation-table-col";
import { DialogWrapper } from "@/components/common/DialogWrapper";

const AgentProfileCreationTable = () => {
  const columns = getAgentProfileCreationColumn();

  const handleCreateUser = () => {
    // Handle user creation logic
    console.log("Creating agent...");
  };

  return (
    <div className="">
      <DynamicTable
        columns={columns}
        data={[]}
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="agentCode"
        renderLeftSideActions={() => (
          <DialogWrapper
            triggerBtnText="Create Agent Profile"
            title="Create New Agent"
            description="Fill in the details to create a new agent"
            renderContent={<div>Form goes here...</div>}
            onSave={handleCreateUser}
           footerBtnText="Create"
          />
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
