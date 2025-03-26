import { Button } from "@/components/ui/button";
import { SignLinkButton } from "@/components/common/SignLinkButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, RefreshCcwDot, X } from "lucide-react";

const NiumOrderID = ({
  rowData,
  openModal,
}: {
  rowData: any;
  openModal: (value: string) => void;
}) => {
  
  const isNuimOrderIdActive__esign =
    rowData?.is_esign_required === true &&
    rowData?.is_v_kyc_required === false &&
    rowData?.e_sign_status === "completed" &&
    rowData?.v_kyc_status === "not required";

  const isNuimOrderIdActive__vkcy =
    rowData?.is_esign_required === false &&
    rowData?.is_v_kyc_required === true &&
    rowData?.e_sign_status === "not required" &&
    rowData?.v_kyc_status === "completed";

  const isNuimOrderIdActive__esignVkcy =
    rowData?.is_esign_required === true &&
    rowData?.is_v_kyc_required === true &&
    rowData?.e_sign_status === "completed" &&
    rowData?.v_kyc_status === "completed";

  // const isNuimOrderIdDisabled = rowData?.e_sign_status === "not generated" || rowData?.e_sign_status === "pending" || rowData?.e_sign_status === null
  // const isNuimOrderIdActive = rowData?.e_sign_status === "not generated" || rowData?.e_sign_status === "pending"

  return (
    <button
      className="text-pink-600 cursor-pointer underline flex items-center justify-center gap-1 disabled:opacity-50"
      onClick={() => {
        openModal(rowData);
      }}
      disabled={!(isNuimOrderIdActive__esign || isNuimOrderIdActive__vkcy || isNuimOrderIdActive__esignVkcy)}
    >
      {rowData.nium_order_id}
      <ExternalLink
        size={15}
        className="mr-2"
        style={{
          display:
            !isNuimOrderIdActive__esign &&
            !isNuimOrderIdActive__vkcy &&
            !isNuimOrderIdActive__esignVkcy
              ? "none"
              : "block",
        }}
      />
    </button>
  );
};

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
      <NiumOrderID rowData={rowData} openModal={openModal} />
    ),
  },
  {
    key: "partner_order_id",
    id: "partner_order_id",
    name: "Partner ID",
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
  {
    key: "v_kyc_link",
    id: "v_kyc_link",
    name: "Vkyc Link",
    className: "min-w-0 max-w-[80px]",
    cell: (_: unknown, rowData: any) => (
      <SignLinkButton
        copyLinkUrl={rowData.v_kyc_link}
        buttonText={"Vkyc Link"}
        disabled={rowData.v_kyc_link === null}
        tooltipText={"Copy Vkyc Link"}
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleRegeneratedEsignLink(rowData)}
              className="flex items-center justify-center mx-auto text-white  disabled:bg-gray-200 disabled:text-gray-500"
              size={"sm"}
              disabled={
                rowData?.incident_status ||
                rowData?.incident_status === null ||
                rowData?.incident_status === undefined
              }
            >
              <RefreshCcwDot className="cursor-pointer" size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-400">
            Generate Esign Link
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  // {
  //   key: "generateEsign",
  //   id: "generateEsign",
  //   name: "Generate E Sign",
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
    key: "release",
    id: "release",
    name: "Release",
    className: "min-w-0",
    cell: (_: unknown, rowData: any) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => handleUnassign(rowData)}
              className="flex items-center justify-center mx-auto"
              size={"sm"}
            >
              <X className="text-white cursor-pointer" size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-400">Release Order</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
];
