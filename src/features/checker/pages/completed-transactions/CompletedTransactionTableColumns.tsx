import { formatDate } from '@/utils/dateFormat';
export const GetTransactionTableColumns = () => [
  {
    key: 'niumId',
    id: 'niumId',
    name: 'Nium ID',
    cell: (value: string) => <span className="text-pink-600">{value}</span>,
  },
  {
    key: 'orderDate',
    id: 'created_at',
    name: 'Order Date',
    cell: (_: unknown, rowData: any) => (
      <span>{rowData?.orderDate ? formatDate(rowData?.orderDate) : null}</span>
    ),
  },
  {
    key: 'agentId',
    id: 'agentId',
    name: 'Agent ID',
  },
  {
    key: 'customerPan',
    id: 'customerPan',
    name: 'Customer PAN',
  },
  {
    key: 'transactionType',
    id: 'transactionType',
    name: 'Transaction Type',
  },
  {
    key: 'purposeType',
    id: 'purposeType',
    name: 'Purpose Type',
  },
  {
    key: 'esignStatus',
    id: 'esignStatus',
    name: 'E-Sign Status',
  },
  {
    key: 'esignStatusCompletionDate',
    id: 'esignStatusCompletionDate',
    name: 'E-Sign Status Completion Date',
    cell: (_: unknown, rowData: any) => (
      <span>
        {rowData?.esignStatusCompletionDate
          ? formatDate(rowData?.esignStatusCompletionDate)
          : null}
      </span>
    ),
  },
  {
    key: 'vkycStatus',
    id: 'vkycStatus',
    name: 'VKYC Status',
  },
  {
    key: 'vkycCompletionDate',
    id: 'vkycCompletionDate',
    name: 'VKYC Completion Date',
    cell: (_: unknown, rowData: any) => (
      <span>
        {rowData?.esignStatusCompletionDate
          ? formatDate(rowData?.esignStatusCompletionDate)
          : null}
      </span>
    ),
  },
  {
    key: 'incidentStatus',
    id: 'incidentStatus',
    name: 'Incident Status',
  },
  {
    key: 'incidentCompletionDate',
    id: 'incidentCompletionDate',
    name: 'Incident Completion Date',
  },
  {
    key: 'niumInvoiceNumber',
    id: 'niumInvoiceNumber',
    name: 'NIUM INVOICE NUMBER',
  },
];
