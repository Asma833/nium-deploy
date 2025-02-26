import { Checkbox } from "@/components/ui/checkbox";
export const getTransactionTableColumns = () => [
    {
        key: "select",
        id: "select",
        name: "Select",
        cell: (value: boolean, row: any) => (
          <Checkbox
            checked={value}
            onCheckedChange={(checked) => (row.select = checked)} // Update row selection
          />
        ),
      },
    
    {
      key: "niumId",
      id: "niumId",
      name: "Nium ID",
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
  