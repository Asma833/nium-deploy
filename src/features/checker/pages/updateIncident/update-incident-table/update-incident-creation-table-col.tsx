import { Button } from "@/components/ui/button";
import { SignLinkButton } from "@/features/e-sign/components/SignLinkButton";
import {
  determinePurposeType,
  determineTransactionType,
} from "@/utils/getTransactionConfigTypes";
import { X } from "lucide-react";

export const getTransactionTableColumns = (
  openModal: (value: string) => void,
  handleUnassign: (rowData: any) => void,
) => [
  {
    key: "nium_order_id",
    id: "nium_order_id",
    name: "Nium ID",
    cell: (_: unknown, rowData: any) => (
      <span
        className="text-pink-600 cursor-pointer"
        onClick={() => {
          openModal(rowData);
        }}
      >
        {rowData.nium_order_id}
      </span>
    ),
  },
  {
    key: "partner_order_id",
    id: "partner_order_id",
    name: "BMF ID",
  },
  {
    key: "createdAt",
    id: "createdAt",
    name: "Order Date",
  },
  {
    key: "customer_pan",
    id: "customer_pan",
    name: "Customer PAN",
  },
  {
    key: "transaction_type",
    id: "transaction_type",
    name: "Transaction Type",
    cell: (_: unknown, rowData: any) =>
      determineTransactionType(rowData.transaction_type),
  },
  {
    key: "purpose_type",
    id: "purpose_type",
    name: "Purpose Type",
    cell: (_: unknown, rowData: any) =>
      determinePurposeType(rowData.purpose_type),
  },
  {
    key: "e_sign_status",
    id: "e_sign_status",
    name: "E-Sign Status",
  },
  {
    key: "v_kyc_status",
    id: "v_kyc_status",
    name: "VKYC Status",
  },
  {
    key: "incident_status",
    id: "incident_status",
    name: "Incident Status",
  },
  {
    key: "e_sign_link",
    id: "e_sign_link",
    name: "E Sign Link",
    cell: (_: unknown, rowData: any) => (
      <SignLinkButton copyLinkUrl={rowData.e_sign_link} buttonText={"E Sign"} />
    ),
  },
  {
    key: "merged_document",
    id: "merged_document",
    name: "Merged Document",
    cell: (_: unknown, rowData: any) => (
      <SignLinkButton copyLinkUrl={rowData.e_sign_link} buttonText={"E Sign"} />
    ),
  },
  {
    key: "release",
    id: "release",
    name: "Release",
    cell: (_: unknown, rowData: any) => (
      <Button
        onClick={() => handleUnassign(rowData)}
        className="flex items-center"
        size={"sm"}
      >
        <X className="text-white cursor-pointer" size={20} />
        Unassign
      </Button>
    ),
  },
];
