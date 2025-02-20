import { EditIcon, EyeIcon } from "lucide-react";

export const getAgentProfileCreationColumn = () => [
  {
    key: "agentCode",
    id: "agentCode",
    name: "Agent Code",
  },
  {
    key: "hqAgentName",
    id: "hqAgentName",
    name: "HQ Agent Name",
  },
  {
    key: "hqBranchUserName",
    id: "hqBranchUserName",
    name: "HQ Branch User Name",
  },
  {
    key: "hqBranchCity",
    id: "hqBranchCity",
    name: "HQ Branch City",
  },
  {
    key: "hqBranchState",
    id: "hqBranchState",
    name: "HQ Branch State",
  },
  {
    key: "hoNiumRmBranch",
    id: "hoNiumRmBranch",
    name: "HO NIUM RM Branch",
  },
  {
    key: "hoNiumBranchHead",
    id: "hoNiumBranchHead",
    name: "HO NIUM Branch Head",
  },
  {
    key: "status",
    id: "status",
    name: "Status",
    cell: (value: string) => (
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap">{value}</span>
        <div className={`w-2 h-2 rounded-full ${value.toLowerCase() === 'active' ? 'bg-pink-500' : 'bg-gray-400'}`} />
      </div>
    ),
  },
  {
    key: "actions",
    id: "actions",
    name: "Action",
    cell: (_: unknown, row: any) => (
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Edit:", row);
          }}
          className="p-2"
        >
          <EditIcon className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("View:", row);
          }}
          className="p-2"
        >
          <EyeIcon className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    ),
  },
];
