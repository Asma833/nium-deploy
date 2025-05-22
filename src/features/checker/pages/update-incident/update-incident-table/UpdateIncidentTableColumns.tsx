import { SignLinkButton } from '@/components/common/SignLinkButton';
import PurposeType from '@/features/checker/components/table/PurposeType';
import TransactionType from '@/features/checker/components/table/TransactionType';
import IncidentStatusCell from '@/features/checker/components/table/IncidentStatusCell';
import EsignStatusCell from '@/features/checker/components/table/EsignStatusCell';
import VKycStatusCell from '@/features/checker/components/table/VKycStatusCell';
import NiumOrderID from '@/features/checker/components/table/NiumOrderIdCell';
import CompletedTransactionStatusCell from '@/features/checker/components/table/CompletedTransactionStatusCell';

export const GetTransactionTableColumns = (
  openModal: (value: string) => void,
  handleUnassign: (rowData: any) => void,
  handleRegeneratedEsignLink: (rowData: any) => void,
  isSendEsignLinkLoading: boolean,
  loadingOrderId: string // Add this parameter
) => [
  {
    key: 'nium_order_id',
    id: 'nium_order_id',
    name: 'Nium ID',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => (
      <NiumOrderID rowData={rowData} openModal={openModal} />
    ),
  },
  {
    key: 'partner_order_id',
    id: 'partner_order_id',
    name: 'Partner Order ID',
    className: 'min-w-0',
  },
  {
    key: 'created_at',
    id: 'created_at',
    name: 'Order Date',
    className: 'min-w-0',
  },
  {
    key: 'customer_pan',
    id: 'customer_pan',
    name: 'Customer PAN',
    className: 'min-w-0',
  },
  {
    key: 'transaction_type',
    id: 'transaction_type',
    name: 'Transaction Type',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => <TransactionType rowData={rowData} />,
  },
  {
    key: 'purpose_type',
    id: 'purpose_type',
    name: 'Purpose Type',
    className: 'min-w-0 max-w-[70px]',
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
    key: 'v_kyc_status',
    id: 'v_kyc_status',
    name: 'VKYC Status',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => <VKycStatusCell rowData={rowData} />,
  },
  {
    key: 'incident_status',
    id: 'incident_status',
    name: 'Incident Status',
    className: 'min-w-0  max-w-[70px]',
    cell: (_: unknown, rowData: any) => (
      <IncidentStatusCell rowData={rowData} />
    ),
  },
  {
    key: 'doc_verification_status',
    id: 'doc_verification_status',
    name: 'Completed Transaction Status',
    className: 'min-w-0  max-w-[70px]',
    cell: (_: unknown, rowData: any) => (
      <CompletedTransactionStatusCell rowData={rowData} />
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
        disabled={
          !rowData.e_sign_link || rowData.e_sign_status === 'not generated'
        }
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
        disabled={rowData.v_kyc_link === null}
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
        loading={
          isSendEsignLinkLoading && loadingOrderId === rowData.nium_order_id
        }
        copyLinkUrl={rowData.v_kyc_link}
        tooltipText={'Generate Esign Link'}
        buttonIconType="refresh"
        onClick={() => handleRegeneratedEsignLink(rowData)}
        disabled={(() => {
          const { incident_status, e_sign_status } = rowData || {};
          const disabledEsignStatuses = [
            'expired',
            'rejected',
            'not generated',
          ];

          return (
            incident_status === null ||
            incident_status === undefined ||
            Boolean(incident_status) ||
            disabledEsignStatuses.includes(e_sign_status)
          );
        })()}
      />
    ),
  },
  {
    key: 'release',
    id: 'release',
    name: 'Release',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => (
      <SignLinkButton
        id={rowData.nium_order_id}
        loading={
          isSendEsignLinkLoading && loadingOrderId === rowData.nium_order_id
        }
        copyLinkUrl={rowData.v_kyc_link}
        tooltipText={'Release Order'}
        buttonIconType={'remove'}
        onClick={() => handleUnassign(rowData)}
      />
    ),
  },
];
