import { formatDate } from '@/utils/dateFormat';
import IncidentStatusCell from '../../components/table/IncidentStatusCell';
import VKycStatusCell from '../../components/table/VKycStatusCell';
import EsignStatusCell from '../../components/table/EsignStatusCell';
import NiumOrderID from '../../components/table/NiumOrderIdCell';

export const GetTransactionTableColumns = (
  openModal: (value: string) => void
) => [
  {
    key: 'nium_order_id',
    id: 'nium_order_id',
    name: 'Nium ID',
    cell: (_: unknown, rowData: any) => (
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
    cell: (
      _: unknown,
      rowData: { e_sign_customer_completion_date?: string }
    ) => (
      <span>
        {rowData.e_sign_customer_completion_date
          ? formatDate(rowData.e_sign_customer_completion_date)
          : null}
      </span>
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
    cell: (
      _: unknown,
      rowData: { v_kyc_customer_completion_date?: string }
    ) => (
      <span>
        {rowData.v_kyc_customer_completion_date
          ? formatDate(rowData.v_kyc_customer_completion_date)
          : null}
      </span>
    ),
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
    cell: (_: unknown, rowData: { incident_completion_date?: string }) => (
      <span>
        {rowData.incident_completion_date
          ? formatDate(rowData.incident_completion_date)
          : null}
      </span>
    ),
  },
  {
    key: 'nium_invoice_number',
    id: 'nium_invoice_number',
    name: 'NIUM INVOICE NUMBER',
  },
];
