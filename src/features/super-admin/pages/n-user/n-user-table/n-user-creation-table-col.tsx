import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Switch from "@/components/ui/switch";

export const getUserTableColumns = (handleStatusChange: (index: number, checked: boolean) => void) => {
  const navigate = useNavigate(); // Initialize navigate

  return [
    {
      key: "userName",
      id: "userName",
      name: "User Name",
    },
    {
      key: "email",
      id: "email",
      name: "Email",
    },
    {
      key: "productType",
      id: "productType",
      name: "Product Type",
    },
    {
      key: "creationDate",
      id: "creationDate",
      name: "Creation Date",
    },
    {
      key: "status",
      id: "status",
      name: "Status",
      cell: (value: boolean, index: number) => (
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">{value ? "Active" : "Inactive"}</span>
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleStatusChange(index, checked)}
          />
        </div>
      ),
    },
    {
      key: "actions",
      id: "actions",
      name: "Action",
      cell: (rowData: any) => (
        <div className="flex gap-2">
          <button
            className="p-2 rounded-md hover:bg-muted/20"
            onClick={() => navigate(`update-user/1`)} // Navigate to edit page
          >
            <Edit className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      ),
    },
  ];
};
