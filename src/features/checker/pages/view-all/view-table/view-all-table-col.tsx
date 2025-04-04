import { formatDate } from '@/utils/dateFormat';
import {
  determinePurposeType,
  determineTransactionType,
} from '@/utils/getTransactionConfigTypes';

export const getTransactionTableColumns = () => [
  {
    key: 'niumId',
    id: 'niumId',
    name: 'Nium ID',
    cell: (value: string) => <span className="text-pink-600">{value}</span>,
    className: 'min-w-0',
  },
  {
    key: 'orderDate',
    id: 'orderDate',
    name: 'Order Date',
    className: 'min-w-0',
    cell: (_: unknown, rowData: { orderDate?: string }) => (
      <span>{rowData.orderDate ? formatDate(rowData.orderDate) : null}</span>
    ),
  },
  {
    key: 'agentId',
    id: 'agentId',
    name: 'Agent ID',
    className: 'min-w-0',
  },
  {
    key: 'customerPan',
    id: 'customerPan',
    name: 'Customer PAN',
    className: 'min-w-0',
  },
  {
    key: 'transactionType',
    id: 'transactionType',
    name: 'Transaction Type',
    className: 'min-w-0',
  },
  {
    key: 'purposeType',
    id: 'purposeType',
    name: 'Purpose Type',
    className: 'min-w-0',
  },
  {
    key: 'esignStatus',
    id: 'esignStatus',
    name: 'E-Sign Status',
    className: 'min-w-0',
  },
  {
    key: 'esignStatusCompletionDate',
    id: 'esignStatusCompletionDate',
    name: 'E-Sign Status Completion Date',
    className: 'min-w-0',
    cell: (_: unknown, rowData: { esignStatusCompletionDate?: string }) => (
      <span>
        {rowData.esignStatusCompletionDate
          ? formatDate(rowData.esignStatusCompletionDate)
          : null}
      </span>
    ),
  },
  {
    key: 'vkycStatus',
    id: 'vkycStatus',
    name: 'VKYC Status',
    className: 'min-w-0',
  },
  {
    key: 'vkycCompletionDate',
    id: 'vkycCompletionDate',
    name: 'VKYC Completion Date',
    className: 'min-w-0',
    cell: (_: unknown, rowData: { vkycCompletionDate?: string }) => (
      <span>
        {rowData.vkycCompletionDate
          ? formatDate(rowData.vkycCompletionDate)
          : null}
      </span>
    ),
  },
  {
    key: 'incidentStatus',
    id: 'incidentStatus',
    name: 'Incident Status',
    className: 'min-w-0',
  },
  {
    key: 'incidentCompletionDate',
    id: 'incidentCompletionDate',
    name: 'Incident Completion Date',
    className: 'min-w-0',
    cell: (_: unknown, rowData: { incidentCompletionDate?: string }) => (
      <span>
        {rowData.incidentCompletionDate
          ? formatDate(rowData.incidentCompletionDate)
          : null}
      </span>
    ),
  },
];
