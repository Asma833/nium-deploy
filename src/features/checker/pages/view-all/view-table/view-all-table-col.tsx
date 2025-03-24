import {
  determinePurposeType,
  determineTransactionType,
} from "@/utils/getTransactionConfigTypes";

export const getTransactionTableColumns = () => [
  {
    key: "niumId",
    id: "niumId",
    name: "Nium ID",
    cell: (value: string) => <span className="text-pink-600">{value}</span>,
    className: "min-w-0",
  },
  {
    key: "orderDate",
    id: "orderDate",
    name: "Order Date",
    className: "min-w-0",
  },
  {
    key: "agentId",
    id: "agentId",
    name: "Agent ID",
    className: "min-w-0",
  },
  {
    key: "customerPan",
    id: "customerPan",
    name: "Customer PAN",
    className: "min-w-0",
  },
  {
    key: "transactionType",
    id: "transactionType",
    name: "Transaction Type",
    className: "min-w-0",
    cell: (_: unknown, rowData: any) =>
      determineTransactionType(rowData.transactionType),
  },
  {
    key: "purposeType",
    id: "purposeType",
    name: "Purpose Type",
    className: "min-w-0",
    cell: (_: unknown, rowData: any) =>
      determinePurposeType(rowData.purposeType),
  },
  {
    key: "esignStatus",
    id: "esignStatus",
    name: "E-Sign Status",
    className: "min-w-0",
  },
  {
    key: "esignStatusCompletionDate",
    id: "esignStatusCompletionDate",
    name: "E-Sign Status Completion Date",
    className: "min-w-0",
  },
  {
    key: "vkycStatus",
    id: "vkycStatus",
    name: "VKYC Status",
    className: "min-w-0",
  },
  {
    key: "vkycCompletionDate",
    id: "vkycCompletionDate",
    name: "VKYC Completion Date",
    className: "min-w-0",
  },
  {
    key: "incidentStatus",
    id: "incidentStatus",
    name: "Incident Status",
    className: "min-w-0",
  },
  {
    key: "incidentCompletionDate",
    id: "incidentCompletionDate",
    name: "Incident Completion Date",
    className: "min-w-0",
  },
];
