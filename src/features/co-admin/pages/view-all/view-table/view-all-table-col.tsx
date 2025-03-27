import {
  determinePurposeType,
  determineTransactionType,
} from "@/utils/getTransactionConfigTypes";

export const getTransactionTableColumns = () => [
  {
    key: "nium_order_id",
    id: "nium_order_id",
    name: "Nium ID",
    cell: (value: string) => <span className="text-pink-600">{value}</span>,
    className: "min-w-0",
  },
  // {
  //   key: "orderDate",
  //   id: "orderDate",
  //   name: "Order Date",
  //   className: "min-w-0",
  // },
  // {
  //   key: "agentId",
  //   id: "agentId",
  //   name: "Agent ID",
  //   className: "min-w-0",
  // },
  {
    key: "customer_pan",
    id: "customer_pan",
    name: "Customer PAN",
    className: "min-w-0",
  },
  {
    key: "transaction_type",
    id: "transaction_type",
    name: "Transaction Type",
    className: "min-w-0",
    cell: (_: unknown, rowData: any) =>
      determineTransactionType(rowData.transaction_type),
  },
  {
    key: "purpose_type",
    id: "purpose_type",
    name: "Purpose Type",
    className: "min-w-0",
    cell: (_: unknown, rowData: any) =>
      determinePurposeType(rowData.purpose_type),
  },
  {
    key: "e_sign_status",
    id: "e_sign_status",
    name: "E-Sign Status",
    className: "min-w-0",
  },
  {
    key: "incident_completion_date",
    id: "incident_completion_date",
    name: "E-Sign Status Completion Date",
    className: "min-w-0",
  },
  {
    key: "v_kyc_status",
    id: "v_kyc_status",
    name: "VKYC Status",
    className: "min-w-0",
  },
  {
    key: "v_kyc_customer_completion_date",
    id: "v_kyc_customer_completion_date",
    name: "VKYC Completion Date",
    className: "min-w-0",
  },
  {
    key: "incident_status",
    id: "incident_status",
    name: "Incident Status",
    className: "min-w-0",
  },
  {
    key: "incident_completion_date",
    id: "incident_completion_date",
    name: "Incident Completion Date",
    className: "min-w-0",
  },
];
