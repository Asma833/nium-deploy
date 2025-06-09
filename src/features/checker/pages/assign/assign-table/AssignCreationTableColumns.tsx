import NiumOrderID from '@/features/checker/components/table/NiumOrderIdCell';
import PurposeType from '@/features/checker/components/table/PurposeType';
import TransactionType from '@/features/checker/components/table/TransactionType';
import { formatDate } from '@/utils/dateFormat';

export const GetAssignCreationColumns = (
  handleSelectionChange: (rowId: string, checked: boolean) => void,
  openModal: (value: string) => void
) => [
  {
    key: 'select',
    id: 'select',
    name: 'Select',
    className: 'min-w-0 p-2',
    cell: (value: boolean, row: any) => {
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => handleSelectionChange(row.partner_order_id, e.target.checked)}
          className="relative h-5 w-5 cursor-pointer rounded-sm border-2 transition-all duration-300 inline-block align-middle accent-[#E53888]"
        />
      );
    },
  },
  {
    key: 'nium_order_id',
    id: 'nium_order_id',
    name: 'Nium ID',
    className: 'min-w-0 p-2',
    cell: (_: unknown, rowData: any) => <NiumOrderID rowData={rowData} />,
  },
  {
    key: 'partner_order_id',
    id: 'partner_order_id',
    name: 'Partner Order ID',
  },
  {
    key: 'created_at',
    id: 'created_at',
    name: 'Order Date',
      cell: (_: unknown, rowData: { created_at?: string }) => (
          <span>{rowData.created_at ? formatDate(rowData.created_at) : null}</span>
        ),
  },
  {
    key: 'customer_pan',
    id: 'customer_pan',
    name: 'Customer PAN',
  },
  {
    key: 'transaction_type',
    id: 'transaction_type',
    name: 'Transaction Type',
    cell: (_: unknown, rowData: any) => <TransactionType rowData={rowData} />,
  },
  {
    key: 'purpose_type',
    id: 'purpose_type',
    name: 'Purpose Type',
    cell: (_: unknown, rowData: any) => <PurposeType rowData={rowData} />,
  },
];
