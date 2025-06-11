import { SignLinkButton } from '@/components/common/SignLinkButton';
import ViewButton from '@/components/common/ViewButton';
import EsignStatusCell from '@/features/checker/components/table/EsignStatusCell';
import { Eye, FileText, ExternalLink } from 'lucide-react'; // Import the necessary Lucide icons

export const ViewStatusColumns = ({openModal}:{openModal: (rowData: any) => void;}) => [
  {
    key: 'nium_order_id',
    id: 'nium_order_id',
    name: 'Transaction No',
    className: 'min-w-0 p-2'
  },
  {
    key: 'created_at',
    id: 'created_at',
    name: 'Created Date',
    className: 'min-w-0 p-2'
  },
  {
    key: 'expiry_date',
    id: 'expiry_date',
    name: 'Expiry Date',
    className: 'min-w-0 p-2',
  },
  {
    key: 'applicant_name',
    id: 'applicant_name',
    name: 'Applicant Name',
    className: 'min-w-0 p-2'
  },
  {
    key: 'applicant_pan_no',
    id: 'applicant_pan_no',
    name: 'Applicant PAN No',
    className: 'min-w-0 p-2'
  },
  {
    key: 'transaction_type_name.name',
    id: 'transaction_type_name.name',
    name: 'Transaction Type',
    className: 'min-w-0 p-2'
  },
  {
    key: 'purpose_type_name.purpose_name',
    id: 'purpose_type_name.purpose_name',
    name: 'Purpose',
    className: 'min-w-0 p-2'
  },
  {
    key: 'transaction_status',
    id: 'transaction_status',
    name: 'Transaction Status',
    className: 'min-w-0 p-2',
      cell: (_:any, value: any) => (
      <EsignStatusCell rowData={value} />
    )
  },
  {
    key: 'e_sign_status',
    id: 'e_sign_status',
    name: 'E Sign Status',
    className: 'min-w-0 p-2',
    cell: (_:any, value: any) => (
      <EsignStatusCell rowData={value} />
    )
  },
 {
  key: 'e_sign_link',
  id: 'e_sign_link',
  name: 'E Sign Link',
  className: 'min-w-0 max-w-[80px]',
  cell: (_: unknown, rowData: any) => {
    const { e_sign_link, e_sign_status, transaction_status } = rowData;
    
    const isActionNeeded = e_sign_status === 'rejected' || 
                           e_sign_status === 'expired' || 
                           transaction_status === 'rejected' || 
                           transaction_status === 'expired';
                           
    return (
      <SignLinkButton
        copyLinkUrl={e_sign_link}
        toastInfoText={'E Sign link copied successfully!'}
        disabled={!e_sign_link || e_sign_status === 'not generated'}
        tooltipText={isActionNeeded ? 'Generate E sign Link' : 'Copy E sign Link'}
        buttonType={isActionNeeded ? 'refresh' : 'copy_link'}
        buttonIconType={isActionNeeded ? 'refresh' : 'copy_link'}
      />
    );
  }
},
  {
    key: 'view_action',
    id: 'view_action',
    name: 'View',
    className: 'min-w-0 p-2',
    cell: (_: unknown, rowData: any) => (
      <ViewButton
        onClick={() => {
          openModal(rowData)
        }}
        tooltipText={`View`}
        orderId={rowData.nium_order_id}
        disabled={false}
        buttonType="view_details"
        buttonIconType="view"
      />
    )
  }
];