import { DynamicTable } from "@/components/common/DynamicTable";
import { getAgentBranchUserColumn } from "./agent-branch-user-table-col";
import { DialogWrapper } from "@/components/common/DialogWrapper";

const AgentBranchUserTable = () => {
  const columns = getAgentBranchUserColumn();

  const handleCreateUser = () => {
    // Handle user creation logic
    console.log("Creating user...");
  };

  return (
    <div className="">
      <DynamicTable
        columns={columns}
        data={[]}
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="requestId"
        renderLeftSideActions={() => (
          <DialogWrapper
            triggerBtnText="Create Agent Branch User"
            title="Create New User"
            description="Fill in the details to create a new user"
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

export default AgentBranchUserTable;
