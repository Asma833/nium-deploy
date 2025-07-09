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
      key: 'partner_id',
      id: 'partner_id',
      name: 'Partner ID',
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
      key: 'incident_status',
      id: 'incident_status',
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
      key: 'e_sign_link',
      id: 'e_sign_link',
      name: 'E Sign Link',
      className: 'min-w-0 max-w-[80px]',
      cell: (_: unknown, rowData: any) => (
        <SignLinkButton
          copyLinkUrl={rowData.e_sign_link}
          toastInfoText={'E Sign link copied successfully!'}
          disabled={isLinkDisabled(rowData.e_sign_link, rowData.e_sign_status)}
          tooltipText={'Copy E sign Link'}
          buttonType="copy_link"
          buttonIconType="copy_link"
        />
      ),
    },
    {
      key: 'v_kyc_link',
      id: 'v_kyc_link',
      name: 'VKYC Link',
      className: 'min-w-0 max-w-[80px]',
      cell: (_: unknown, rowData: any) => (
        <SignLinkButton
          copyLinkUrl={rowData.v_kyc_link}
          toastInfoText={'Vkyc Link link copied successfully!'}
          disabled={isLinkDisabled(rowData.v_kyc_link, rowData.v_kyc_status)}
          tooltipText={'Copy VKYC Link'}
          buttonType="copy_link"
          buttonIconType="copy_link"
        />
      ),
    },
    {
      key: 'generate_esign_link',
      id: 'generate_esign_link',
      name: 'Generate Esign Link',
      className: 'min-w-0 max-w-[100px]',
      cell: (_: unknown, rowData: any) => (
        <SignLinkButton
          id={rowData.nium_order_id}
          loading={isSendEsignLinkLoading && loadingOrderId === rowData.nium_order_id}
          copyLinkUrl={rowData.v_kyc_link}
          tooltipText="Generate Esign Link"
          buttonIconType="refresh"
          onClick={() => handleRegenerateEsignLink(rowData)}
          disabled={(() => {
            const { e_sign_status, order_status } = rowData || {};

            return DISABLED_ORDER_STATUSES.includes(order_status) || DISABLED_ESIGN_STATUSES.includes(e_sign_status);
          })()}
        />
      ),
    },
  ];
};
