import { CustomCheckbox } from '@/components/common/Checkbox';
import { Edit, Trash2 } from 'lucide-react';

export const PurposeDocumentColumn = ({
  handleDelete,
  handleEditDocument,
  handleSelectionChange,
  handleMandatoryChange,
  handleBackMandatoryChange,
  disabled: isDisabled = false,
}: {
  handleDelete: (rowData: any) => void;
  handleEditDocument: (rowData: any) => void;
  handleSelectionChange: (rowId: string, isSelected: boolean) => void;
  handleMandatoryChange: (rowId: string, isChecked: boolean) => void;
  handleBackMandatoryChange: (rowId: string, isChecked: boolean) => void;
  disabled?: boolean;
}) => {
  return [
    {
      key: 'select',
      id: 'select',
      name: 'Select',
      className: 'min-w-0 p-2',
      cell: (_:any, row: any) => {
        return (
          <CustomCheckbox
            rowId={row.id}
            value={row.isSelected ?? false}
            label=""
            requirementType="select"
            onChange={handleSelectionChange}
            disabled={isDisabled}
          />
        );
      },
    },
    {
      key: 'name',
      id: 'name',
      name: 'Document Name',
      className: 'text-left',
    },
    {
      key: 'requirement',
      id: 'requirement',
      name: 'Mandatory',
      cell: (_:any, row: any) => (
        <CustomCheckbox
          rowId={row.id}
          value={row.requirement ?? false}
          label="Mandatory"
          requirementType="mandatory"
          onChange={handleMandatoryChange}
          disabled={isDisabled}
        />
      ),
    },
    {
      key: 'backRequirement',
      id: 'backRequirement',
      name: 'Back Required',
      cell: (_:any, row: any) => (
        <CustomCheckbox
          rowId={row.id}
          value={row.backRequirement ?? false}
          label="Back Required"
          requirementType="back-required"
          onChange={handleBackMandatoryChange}
          disabled={isDisabled}
        />
      ),
    },
    {
      key: 'actions',
      id: 'actions',
      name: 'Action',
      cell: (_: any, rowData: any) => {
        return (
          <div className="flex flex-row items-center justify-center">
            <button className="p-2 rounded-md hover:bg-muted/20" onClick={() => handleEditDocument(rowData)}>
              <Edit className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              className="p-2 rounded-md hover:bg-muted/20"
              onClick={() => {
                handleDelete(rowData);
              }}
            >
              <Trash2 className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        );
      },
    },
  ];
};
