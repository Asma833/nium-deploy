import { Button } from "@/components/ui/button";
import { SignLinkButton } from "@/features/e-sign/components/SignLinkButton";
import {
  determinePurposeType,
  determineTransactionType,
} from "@/utils/getTransactionConfigTypes";
import { X } from "lucide-react";
import { Share2 } from "lucide-react";

export const getTransactionTableColumns = (
  openModal: (value: string) => void,
  handleUnassign: (rowData: any) => void,
  handleRegeneratedEsignLink: (rowData: any) => void
) => [
  {
    key: "nium_order_id",
    id: "nium_order_id",
    name: "Nium ID",
    className: "min-w-0",
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
    className: "min-w-0",
  },
  {
    key: "createdAt",
    id: "createdAt",
    name: "Order Date",
    className: "min-w-0",
  },
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
    cell: (_: unknown, rowData: any) => (
      <span>{rowData.transaction_type.text}</span>
    ),
  },
  {
    key: "purpose_type",
    id: "purpose_type",
    name: "Purpose Type",
    className: "min-w-0 max-w-[70px]",
    cell: (_: unknown, rowData: any) => (
      <span>{rowData.purpose_type.text}</span>
    ),
  },
  {
    key: "e_sign_status",
    id: "e_sign_status",
    name: "E-Sign Status",
    className: "min-w-0",
  },
  {
    key: "v_kyc_status",
    id: "v_kyc_status",
    name: "VKYC Status",
    className: "min-w-0",
  },
  {
    key: "incident_status",
    id: "incident_status",
    name: "Incident Status",
    className: "min-w-0  max-w-[70px]",
    cell: (_: unknown, rowData: any) => (
      <span>
        {rowData.incident_status === null ||
        rowData.incident_status === undefined ? (
          <span className="text-orange-600">Pending</span>
        ) : rowData.incident_status ? (
          <span className="text-green-600">Approved</span>
        ) : (
          <span className="text-red-600">Rejected</span>
        )}
      </span>
    ),
  },
  {
    key: "e_sign_link",
    id: "e_sign_link",
    name: "E Sign Link",
    className: "min-w-0 max-w-[80px]",
    cell: (_: unknown, rowData: any) => (
      <SignLinkButton
        copyLinkUrl={rowData.e_sign_link}
        buttonText={"E Sign"}
        disabled={rowData.e_sign_status === "not generated"}
        tooltipText={"Copy E sign Link"}
      />
    ),
  },
  // {
  //   key: "merged_document",
  //   id: "merged_document",
  //   name: "Merged Document",
  //   className: "min-w-0 max-w-[100px]",
  //   cell: (_: unknown, rowData: any) => (
  //     <SignLinkButton
  //       copyLinkUrl={rowData.e_sign_link}
  //       buttonText={"E Sign"}
  //       tooltipText={"Copy Merged Doc Link"}
  //     />
  //   ),
  // },
  {
    key: "generateLink",
    id: "generateLink",
    name: "Generate Esign Link",
    className: "min-w-0 max-w-[100px]",
    cell: (_: unknown, rowData: any) => (
      <Button
      onClick={() => handleRegeneratedEsignLink(rowData)
      }
      className="flex items-center justify-center mx-auto"
      size={"sm"}
      disabled={rowData?.incident_status || rowData?.incident_status === null}
    >
      <Share2 className="text-white cursor-pointer"  size={20} />
    </Button>
    ),
  },
  {
    key: "release",
    id: "release",
    name: "Release",
    className: "min-w-0",
    cell: (_: unknown, rowData: any) => (
      <Button
        onClick={() => handleUnassign(rowData)}
        className="flex items-center justify-center mx-auto"
        size={"sm"}
      >
        <X className="text-white cursor-pointer" size={20} />
      </Button>
    ),
  },
];
