import { Link as LinkIcon , X } from 'lucide-react';
export const getTransactionTableColumns = (openModal: (value: string) => void) => [
    {
      key: "niumId",
      id: "niumId",
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
    {
      key: "esignStatus",
      id: "esignStatus",
      name: "E-Sign Status",
    },
    {
      key: "vkycStatus",
      id: "vkycStatus",
      name: "VKYC Status",
    },
    {
      key: "incidentStatus",
      id: "incidentStatus",
      name: "Incident Status",
    },
    {
      key: "documentLink",
      id: "documentLink",
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
  