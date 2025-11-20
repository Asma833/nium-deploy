import { Edit } from 'lucide-react';
import Switch from '@/components/ui/switch';
import { HandleNavigate, HandleStatusChange, TableColumn } from '@/features/admin/types/user.types';
import { maskEmail } from '@/utils/masking';

export const GetUserTableColumns = (
  handleStatusChange: HandleStatusChange,
  handleNavigate: HandleNavigate,
  role: string
): TableColumn[] => {
  return [
    {
      key: 'email',
      id: 'email',
      name: 'Email',
      cell: (value: string) => maskEmail(value),
    },
    {
      key: 'actions',
      id: 'actions',
      name: 'Action',
      cell: (_, rowData: any) => {
        const url = role === 'maker' ? 'update-maker' : 'update-user';

        return (
          <div className="flex flex-col items-center">
            <button
              className="p-2 rounded-md hover:bg-muted/20"
              onClick={() => {
                handleNavigate(`${url}/${rowData.id}`, rowData);
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
