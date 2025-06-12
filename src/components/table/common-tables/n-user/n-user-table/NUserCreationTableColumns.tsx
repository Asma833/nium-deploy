import { Edit } from 'lucide-react';
import Switch from '@/components/ui/switch';
import { HandleNavigate, HandleStatusChange, TableColumn } from '@/features/admin/types/user.types';

export const GetUserTableColumns = (
  handleStatusChange: HandleStatusChange,
  handleNavigate: HandleNavigate
): TableColumn[] => {
  return [
    {
      key: 'email',
      id: 'email',
      name: 'Email',
    },
    // {
    //   key: 'createdAt',
    //   id: 'createdAt',
    //   name: 'Creation Date',
    // },
    {
      key: 'status',
      id: 'status',
      name: 'Status',
      cell: (_, row: any) => {
        return (
          <div className="flex flex-col items-center">
            <Switch
              checked={row?.is_active}
              onCheckedChange={(checked) => {
                handleStatusChange(row, checked);
              }}
            />
          </div>
        );
      },
    },

    {
      key: 'actions',
      id: 'actions',
      name: 'Action',
      cell: (_, rowData: any) => {
        return (
          <div className="flex flex-col items-center">
            <button
              className="p-2 rounded-md hover:bg-muted/20"
              onClick={() => {
                handleNavigate(`update-user/${rowData.id}`, rowData);
              }}
            >
              <Edit className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        );
      },
    },
  ];
};
