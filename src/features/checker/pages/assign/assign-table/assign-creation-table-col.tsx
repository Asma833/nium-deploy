import { Checkbox } from "@/components/ui/checkbox";

export const getTransactionTableColumns = (handleStatusChange: (index: number, checked: boolean) => void) => [
  {
    key: "select",
    id: "select",
    name: "Select",
    cell: (rowData: any, index: number) => (
      <Checkbox
        checked={rowData.select} // Bind directly to rowData.select
        onCheckedChange={(checked) => handleStatusChange(index, checked as boolean)}
      />
    ),
  },
  {
    key: "niumId",
    id: "niumId",
    name: "Nium ID",
  },
  {
    key: "bmfId",
    id: "bmfId",
    name: "BMF ID",
  },
  {
    key: "orderDate",
    id: "orderDate",
    name: "Order Date",
  },
  {
    key: "customerPan",
    id: "customerPan",
    name: "Customer PAN",
  },
  {
    key: "transactionType",
    id: "transactionType",
    name: "Transaction Type",
  },
  {
    key: "fxCurrency",
    id: "fxCurrency",
    name: "FX Currency",
  },
  {
    key: "fxValue",
    id: "fxValue",
    name: "FX Value",
  },
  {
    key: "fxRate",
    id: "fxRate",
    name: "FX Rate",
  },
  {
    key: "inrRate",
    id: "inrRate",
    name: "INR Rate",
  },
  {
    key: "purposeType",
    id: "purposeType",
    name: "Purpose Type",
  },
];
