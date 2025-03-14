// import { Checkbox } from "@/components/ui/checkbox";

export const getAssignCreationColumns = (
  handleSelectionChange: (rowId: string, checked: boolean) => void
) => [
  {
    key: "select",
    id: "select",
    name: "Select",
    className: "50px",
    // cell: (row: any) => (
    //   <Checkbox
    //     checked={row.isSelected || false} 
    //     onCheckedChange={(checked) =>
    //       handleSelectionChange(row.niumId, checked as boolean)
    //     } 
    //   />
    // ),
    cell: (value:any,row: any) => (
      <input
        type="checkbox"
        checked={value} // ✅ Ensure it reads the correct value
        onChange={(e) => handleSelectionChange(row.niumId, e.target.checked)}
        className={`h-5 w-5 cursor-pointer rounded-sm border-2 transition-all duration-300`}
        style={{  
          accentColor: value ? "red" : "#E53888", // ✅ WebKit color control
          display: "inline-block",
          verticalAlign: "middle",
          position: "relative",
        }}
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
