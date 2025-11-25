import TooltipActionButton from '@/components/common/TooltipActionButton';
import { formatDate } from '@/utils/dateFormat';
import VKycStatusCell from '../../components/table/VKycStatusCell';
import EsignStatusCell from '../../components/table/EsignStatusCell';
import NiumOrderID from '../../components/table/NiumOrderIdCell';
import OrderStatusCell from '../../components/table/OrderStatusCell';
import { formatDateWithFallback } from '@/utils/formatDateWithFallback';
import { maskPAN } from '@/utils/masking';
import { FileText, Video } from 'lucide-react';

export const GetTransactionTableColumns = ({
  openModal,
  handleEkycStatus,
  handleVkycStatus,
}: {
  openModal: (rowData: any) => void;
  handleEkycStatus: (rowData: any) => void;
  handleVkycStatus: (rowData: any) => void;
}) => [
  {
    key: 'nium_order_id',
    id: 'nium_order_id',
    name: 'Nium ID',
    cell: (_: unknown, rowData: any) => <NiumOrderID rowData={rowData} openModal={openModal} />,
    className: 'min-w-0',
  },
  {
    key: 'created_at',
    id: 'created_at',
    name: 'Order Date',
    className: 'min-w-0',
    cell: (_: unknown, rowData: { created_at?: string }) => <span>{formatDate(rowData.created_at)}</span>,
  },
  {
    key: 'partner_order_id',
    id: 'partner_order_id',
    name: 'Partner Order ID',
    className: 'min-w-0',
  },
  {
    key: 'customer_pan',
    id: 'customer_pan',
    name: 'Customer PAN',
    className: 'min-w-0',
    cell: (value: string) => maskPAN(value),
  },
  {
    key: 'transaction_type_name',
    id: 'transaction_type_name',
    name: 'Transaction Type',
    className: 'min-w-0',
  },
  {
    key: 'purpose_type_name',
    id: 'purpose_type_name',
    name: 'Purpose Type',
    className: 'min-w-0',
  },
  {
    key: 'e_sign_status',
    id: 'e_sign_status',
    name: 'E-Sign Status',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => <EsignStatusCell rowData={rowData} />,
  },
  {
    key: 'e_sign_customer_completion_date',
    id: 'e_sign_customer_completion_date',
    name: 'E-Sign Status Completion Date',
    className: 'min-w-0',
    cell: (_: unknown, rowData: { e_sign_customer_completion_date?: string }) => (
      <span>{formatDateWithFallback(rowData.e_sign_customer_completion_date)}</span>
    ),
  },
  {
    key: 'v_kyc_status',
    id: 'v_kyc_status',
    name: 'VKYC Status',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => <VKycStatusCell rowData={rowData} />,
  },
  {
    key: 'v_kyc_customer_completion_date',
    id: 'v_kyc_customer_completion_date',
    name: 'VKYC Completion Date',
    className: 'min-w-0',
    cell: (_: unknown, rowData: { v_kyc_customer_completion_date?: string }) => (
      <span>{formatDateWithFallback(rowData.v_kyc_customer_completion_date)}</span>
    ),
  },
  {
    key: 'order_status',
    id: 'order_status',
    name: 'Incident Status',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => <OrderStatusCell rowData={rowData} />,
  },
  {
    key: 'incident_completion_date',
    id: 'incident_completion_date',
    name: 'Incident Completion Date',
    className: 'min-w-0',
    cell: (_: unknown, rowData: { incident_completion_date?: string }) => (
      <span>{formatDateWithFallback(rowData.incident_completion_date)}</span>
    ),
  },
  {
    key: 'nium_invoice_number',
    id: 'nium_invoice_number',
    name: 'NIUM INVOICE NUMBER',
  },
  {
    key: 'Action',
    id: 'Action',
    name: 'Action',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => (
      <div className="flex flex-row gap-2">
        <TooltipActionButton
          onClick={() => handleEkycStatus(rowData)}
          icon={<FileText size={16} />}
          tooltipText="Get E-Sign Status"
          variant="esign"
          disabled={rowData.e_sign_link_doc_id === null}
        />
        <TooltipActionButton
          onClick={() => handleVkycStatus(rowData)}
          icon={<Video size={16} />}
          tooltipText="Get VKYC Status"
          variant="vkyc"
          disabled={rowData.v_kyc_status === 'N/A' || rowData.v_kyc_status === 'pending'}
        />
      </div>
    ),
  },
];
