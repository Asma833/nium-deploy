import { Edit } from "lucide-react";
import Switch from "@/components/ui/switch";

interface TableColumn {
  key: string;
  id: string;
  name: string;
  cell?: (value: any, row:any) => React.ReactNode;
}

interface HandleStatusChange {
  (row: any, checked: boolean): void;
}

interface HandleNavigate {
  (path: string,rowData:string): void;
}

export const getUserTableColumns = (
  handleStatusChange: HandleStatusChange,
  handleNavigate: HandleNavigate
): TableColumn[] => {
  return [
    // {
    //   key: "first_name",
    //   id: "first_name",
    //   name: "User Name",
    // },
    {
      key: "email",
      id: "email",
      name: "Email",
    },
    {
      key: "productType",
      id: "productType",
      name: "Product Type",
      cell: (_,row: any) => (
        <span>
          {row.products && row.products.length > 0
            ? row.products.map((product: any) => product.name).join(", ")
            : "No Products"}
        </span>
      ),
    },
    {
      key: "createdAt",
      id: "createdAt",
      name: "Creation Date",
    },
        {
        key: "status",
        id: "status",
        name: "Status",
        cell: (_,row:any) => {
          return (
            <div className="flex flex-col items-start">
              <Switch
                checked={row?.is_active}
                onCheckedChange={(checked) => {handleStatusChange(row, checked)}}
              />
            </div>
          )
        }
      },

    {
      key: "actions",
      id: "actions",
      name: "Action",
      cell: (_,rowData:any) => {
        return(
          <div className="flex gap-2">
            <button
              className="p-2 rounded-md hover:bg-muted/20"
              onClick={() =>{console.log(rowData,"rowData");
                handleNavigate(`update-user/${rowData.hashed_key}`,rowData)}}
            >
              <Edit className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        );
      }
    },
  ];
};
