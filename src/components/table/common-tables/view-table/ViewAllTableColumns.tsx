import { SignLinkButton } from '@/components/common/SignLinkButton';
import { DISABLED_ESIGN_STATUSES, DISABLED_ORDER_STATUSES, EsignStatus } from '@/components/types/status';
import EsignStatusCell from '@/features/checker/components/table/EsignStatusCell';
import NiumOrderID from '@/features/checker/components/table/NiumOrderIdCell';
import OrderStatusCell from '@/features/checker/components/table/OrderStatusCell';
import PurposeType from '@/features/checker/components/table/PurposeType';
import TransactionType from '@/features/checker/components/table/TransactionType';
import VKycStatusCell from '@/features/checker/components/table/VKycStatusCell';
import { formatDateWithFallback } from '@/utils/formatDateWithFallback';

export const GetTransactionTableColumns = ({
  handleRegenerateEsignLink,
  handleRegenerateVkycLink,
  openModal,
  isSendVkycLinkLoading = false,
  isSendEsignLinkLoading = false,
  loadingOrderId = null,
}: {
  handleRegenerateEsignLink: (rowData: any) => void;
  handleRegenerateVkycLink: (rowData: any) => void;
  openModal: (rowData: any) => void;
  isSendEsignLinkLoading?: boolean;
  isSendVkycLinkLoading?: boolean;
  loadingOrderId?: string | null;
}) => {
  const isLinkDisabled = (link: string | null | undefined, status: string | undefined): boolean => {
    return !link || DISABLED_ESIGN_STATUSES.includes(status as EsignStatus);
  };
  return [
    {
      key: 'nium_order_id',
      id: 'nium_order_id',
      name: 'Nium ID',
      className: 'min-w-0 p-2',
      cell: (_: unknown, rowData: any) => <NiumOrderID rowData={rowData} openModal={openModal} />,
    },
    {
      key: 'created_at',
      id: 'created_at',
      name: 'Order Date',
      className: 'min-w-0',
      cell: (_: unknown, rowData: { created_at?: string }) => <span>{formatDateWithFallback(rowData.created_at)}</span>,
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
    },
    {
      key: 'transaction_type_name',
      id: 'transaction_type_name',
      name: 'Transaction Type',
      className: 'min-w-0',
      cell: (_: unknown, rowData: any) => <TransactionType rowData={rowData} />,
    },
    {
      key: 'purpose_type_name',
      id: 'purpose_type_name',
      name: 'Purpose Type',
      className: 'min-w-0',
      cell: (_: unknown, rowData: any) => <PurposeType rowData={rowData} />,
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
      name: 'E-Sign Completion Date',
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
  ];
};
