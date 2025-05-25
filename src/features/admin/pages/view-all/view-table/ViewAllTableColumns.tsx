import CompletedTransactionStatusCell from '@/features/checker/components/table/CompletedTransactionStatusCell';
import EsignStatusCell from '@/features/checker/components/table/EsignStatusCell';
import IncidentStatusCell from '@/features/checker/components/table/IncidentStatusCell';
import NiumOrderID from '@/features/checker/components/table/NiumOrderIdCell';
import VKycStatusCell from '@/features/checker/components/table/VKycStatusCell';
import { Order } from '@/features/checker/types/updateIncident.types';
import { formatDate } from '@/utils/dateFormat';

export const GetTransactionTableColumns = ({
  openModal,
}: {
  openModal: (rowData: any) => void;
}) => [
  {
    key: 'nium_order_id',
    id: 'nium_order_id',
    name: 'Nium ID',
    cell: (value: string, rowData: Order) => (
      <NiumOrderID rowData={rowData} openModal={openModal} />
    ),
    className: 'min-w-0',
  },
  {
    key: 'created_at',
    id: 'created_at',
    name: 'Order Date',
    className: 'min-w-0',
    cell: (_: unknown, rowData: { created_at?: string }) => (
      <span>{rowData.created_at ? formatDate(rowData.created_at) : null}</span>
    ),
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
    cell: (_: unknown, rowData: any) => (
      <span>{rowData?.transaction_type_name?.name || '-'}</span>
    ),
  },
  {
    key: 'purpose_type_name',
    id: 'purpose_type_name',
    name: 'Purpose Type',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => (
      <span>{rowData?.purpose_type_name?.purpose_name || '-'}</span>
    ),
  },
  {
    key: 'e_sign_status',
    id: 'e_sign_status',
    name: 'E-Sign Status',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => <EsignStatusCell rowData={rowData} />,
  },
  {
    key: 'esign_status_completion_date',
    id: 'esign_status_completion_date',
    name: 'E-Sign Status Completion Date',
    className: 'min-w-0',
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
  },
  {
    key: 'incident_status',
    id: 'incident_status',
    name: 'Incident Status',
    className: 'min-w-0',
    cell: (_: unknown, rowData: any) => (
      <IncidentStatusCell rowData={rowData} />
    ),
  },
  {
    key: 'incident_completion_date',
    id: 'incident_completion_date',
    name: 'Incident Completion Date',
    className: 'min-w-0',
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
];
