import { SignLinkButton } from '@/components/common/SignLinkButton';
import ViewButton from '@/components/common/ViewButton';
import { Button } from '@/components/ui/button';
import EsignStatusCell from '@/features/checker/components/table/EsignStatusCell';
import VKycStatusCell from '@/features/checker/components/table/VKycStatusCell';
import { formatDateWithFallback } from '@/utils/formatDateWithFallback';
import { ArrowUpFromLine } from 'lucide-react';
import { useNavigate } from 'react-router';

export const ViewStatusColumns = ({
  handleRegenerateEsignLink,
  openModal,
  isSendEsignLinkLoading = false,
  loadingOrderId = null,
}: {
  handleRegenerateEsignLink: (rowData: any) => void;
  openModal: (rowData: any) => void;
  isSendEsignLinkLoading?: boolean;
  loadingOrderId?: string | null;
}) => {
  const navigate = useNavigate();

  return [
    {
      key: 'nium_order_id',
      id: 'nium_order_id',
      name: 'Transaction No',
      className: 'min-w-0 p-2',
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
      name: 'Created Date',
      className: 'min-w-0 p-2',
      cell: (_: unknown, rowData: { created_at?: string }) => <span>{formatDateWithFallback(rowData.created_at)}</span>,
    },
    {
      key: 'expiry_date',
      id: 'expiry_date',
      name: 'Expiry Date',
      className: 'min-w-0 p-2',
    },
    {
      key: 'customer_name',
      id: 'customer_name',
      name: 'Applicant Name',
      className: 'min-w-0 p-2',
    },
    {
      key: 'customer_pan',
      id: 'customer_pan',
      name: 'Applicant PAN No',
      className: 'min-w-0 p-2',
    },
    {
      key: 'transaction_type_name.name',
      id: 'transaction_type_name.name',
      name: 'Transaction Type',
      className: 'min-w-0 p-2',
    },
    {
      key: 'purpose_type_name.purpose_name',
      id: 'purpose_type_name.purpose_name',
      name: 'Purpose',
      className: 'min-w-0 p-2',
    },
    {
      key: 'incident_status',
      id: 'incident_status',
      name: 'Transaction Status',
      className: 'min-w-0 p-2',
      cell: (_: any, value: any) => <EsignStatusCell rowData={value} />,
    },
    {
      key: 'e_sign_status',
      id: 'e_sign_status',
      name: 'E Sign Status',
      className: 'min-w-0 p-2',
      cell: (_: any, value: any) => <EsignStatusCell rowData={value} />,
    },
    {
      key: 'e_sign_link',
      id: 'e_sign_link',
      name: 'E Sign Link',
      className: 'min-w-0 max-w-[80px]',
      cell: (_: unknown, rowData: any) => {
        const { e_sign_link, e_sign_status, incident_status, e_sign_link_status } = rowData;
        const isActionNeeded =
          e_sign_status === 'rejected' ||
          e_sign_status === 'expired' ||
          incident_status === 'rejected' ||
          incident_status === 'expired' ||
          e_sign_link_status === null;

        return (
          <SignLinkButton
            id={rowData.nium_order_id}
            copyLinkUrl={rowData.e_sign_link || ''}
            loading={isSendEsignLinkLoading && loadingOrderId === rowData.nium_order_id}
            toastInfoText={'E Sign link copied successfully!'}
            disabled={isActionNeeded ? false : !e_sign_link}
            {...(isActionNeeded ? { onClick: () => handleRegenerateEsignLink(rowData) } : {})}
            tooltipText={isActionNeeded ? 'Generate E sign Link' : 'Copy E sign Link'}
            buttonType={isActionNeeded ? 'refresh' : 'copy_link'}
            buttonIconType={isActionNeeded ? 'refresh' : 'copy_link'}
          />
        );
      },
    },
    {
      key: 'v_kyc_status',
      id: 'v_kyc_status',
      name: 'VKYC Status',
      className: 'min-w-0',
      cell: (_: unknown, rowData: any) => <VKycStatusCell rowData={rowData} />,
    },

    {
      key: 'v_kyc_link',
      id: 'v_kyc_link',
      name: 'VKYC Link',
      className: 'min-w-0 max-w-[80px]',
      cell: (_: unknown, rowData: any) => {
        const { v_kyc_status } = rowData;
        const isActionNeeded = v_kyc_status !== 'N/A' && v_kyc_status !== 'completed';
        return (
          <SignLinkButton
            id={rowData.nium_order_id}
            copyLinkUrl={rowData.v_kyc_link}
            loading={isSendEsignLinkLoading && loadingOrderId === rowData.nium_order_id}
            toastInfoText={'Vkyc Link link copied successfully!'}
            disabled={isActionNeeded ? false : !rowData.v_kyc_link}
            {...(isActionNeeded ? { onClick: () => handleRegenerateEsignLink(rowData) } : {})}
            tooltipText={isActionNeeded ? 'Generate VKYC Link' : 'Copy VKYC Link'}
            buttonType={isActionNeeded ? 'refresh' : 'copy_link'}
            buttonIconType={isActionNeeded ? 'refresh' : 'copy_link'}
          />
        );
      },
    },
    {
      key: 'view_action',
      id: 'view_action',
      name: 'Action',
      className: 'min-w-0 p-2',
      cell: (_: unknown, rowData: any) => (
        <div>
          <ViewButton
            onClick={() => {
              openModal(rowData);
            }}
            tooltipText={`View`}
            orderId={rowData.nium_order_id}
            disabled={false}
            buttonType="view_details"
            buttonIconType="view"
          />
          {rowData.merged_document === null && (
            <Button
              size={'sm'}
              className="ml-2 "
              onClick={() => navigate(`/maker/update-transaction`)}
            >
              <ArrowUpFromLine size={20} className="text-foreground" />
            </Button>
          )}
        </div>
      ),
    },
  ];
};
