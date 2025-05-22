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
