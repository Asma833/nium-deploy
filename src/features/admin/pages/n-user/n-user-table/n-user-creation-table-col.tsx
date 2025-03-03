import { Edit } from "lucide-react";
import Switch from "@/components/ui/switch"; // Import Toggle Switch Component

export const getUserTableColumns = (handleStatusChange: (index: number, checked: boolean) => void) => [
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
    cell: () => (
      <div className="flex gap-2">
        <button className="p-2 rounded-md hover:bg-muted/20">
          <Edit className="w-5 h-5 text-muted-foreground" />
        </button>
        
      </div>
    ),
  },
];
