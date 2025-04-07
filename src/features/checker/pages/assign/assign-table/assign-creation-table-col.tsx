export const getAssignCreationColumns = (
  handleSelectionChange: (rowId: string, checked: boolean) => void
) => [
  {
    key: 'select',
    id: 'select',
    name: 'Select',
    className: 'min-w-0 p-2',
    cell: (value: any, row: any) => (
      <input
        type="checkbox"
        checked={value}
        onChange={(e) =>
          handleSelectionChange(row.partner_order_id, e.target.checked)
        }
        className={`h-5 w-5 cursor-pointer rounded-sm border-2 transition-all duration-300`}
        style={{
          accentColor: '#E53888', // Consistent color instead of conditional
          display: 'inline-block',
          verticalAlign: 'middle',
          position: 'relative',
        }}
      />
    ),
  },
  {
    key: 'nium_order_id',
    id: 'nium_order_id',
    name: 'Nium ID',
  },
  {
    key: 'partner_order_id',
    id: 'partner_order_id',
    name: 'Partner ID',
  },
  {
    key: 'createdAt',
    id: 'createdAt',
    name: 'Order Date',
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
    cell: (_: unknown, rowData: any) => (
      <span>{rowData.transaction_type.text}</span>
    ),
  },
  {
    key: 'purpose_type',
    id: 'purpose_type',
    name: 'Purpose Type',
    cell: (_: unknown, rowData: any) => (
      <span>{rowData.purpose_type.text}</span>
    ),
  },
];
