import { Link as LinkIcon , X } from 'lucide-react';
export const getTransactionTableColumns = (openModal: (value: string) => void) => [
    {
      key: "nium_order_id",
      id: "nium_order_id",
      name: "Nium ID",
      cell: (value: string) => (
        <span
          className="text-pink-600 cursor-pointer"
          onClick={() => openModal(value)} // Call openModal when the Nium ID is clicked
        >
          {value}
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
    },
    // {
    //   key: "fxCurrency",
    //   id: "fxCurrency",
    //   name: "FX Currency",
    // },
    // {
    //   key: "fxValue",
    //   id: "fxValue",
    //   name: "FX Value",
    // },
    // {
    //   key: "fxRate",
    //   id: "fxRate",
    //   name: "FX Rate",
    // },
    // {
    //   key: "inrRate",
    //   id: "inrRate",
    //   name: "INR Rate",
    // },
    {
      key: "purpose_type",
      id: "purpose_type",
      name: "Purpose Type",
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
      key: "merged_document",
      id: "merged_document",
      name: "Document Link",
      cell: (value: string) => (
        <a href={value}>
          <LinkIcon className="text-gray-500" />
        </a>
      ),
    },
    {
      key: "release",
      id: "release",
      name: "Release",
      cell: (value: string) => (
        <a href={value}>
          <X className="text-gray-600" />
        </a>
      ),
    },
  ];
  