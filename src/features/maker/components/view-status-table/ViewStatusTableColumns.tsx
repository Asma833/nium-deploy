import { useState } from 'react';
import { useNavigate } from 'react-router';
import { SignLinkButton } from '@/components/common/SignLinkButton';
import TooltipActionButton from '@/components/common/TooltipActionButton';
import EsignStatusCell from '@/features/checker/components/table/EsignStatusCell';
import VKycStatusCell from '@/features/checker/components/table/VKycStatusCell';
import { formatDateWithFallback } from '@/utils/formatDateWithFallback';
import { Edit, Upload, Trash2, Eye } from 'lucide-react';

export const ViewStatusTableColumns = ({
  handleRegenerateEsignLink,
  handleRegenerateVkycLink,
  handleDelete,
  isSendVkycLinkLoading = false,
  isSendEsignLinkLoading = false,
  loadingOrderId = null,
}: {
  handleRegenerateEsignLink: (rowData: any) => void;
  handleRegenerateVkycLink: (rowData: any) => void;
  handleDelete: (rowData: any) => void;
  isSendEsignLinkLoading?: boolean;
  isSendVkycLinkLoading?: boolean;
  loadingOrderId?: string | null;
}) => {
  const navigate = useNavigate();
  const [hasGeneratedLink, setHasGeneratedLink] = useState(false);
  return [
    {
      key: 'nium_order_id',
      id: 'nium_order_id',
      name: 'Transaction No',
      className: 'min-w-0 p-2',
    },
    {
      key: 'created_at',
      id: 'created_at',
      name: 'Created Date',
      className: 'min-w-0 p-2',
      cell: (_: unknown, rowData: { created_at?: string }) => <span>{formatDateWithFallback(rowData.created_at)}</span>,
    },
    {
      key: 'partner_order_id',
      id: 'partner_order_id',
      name: 'Partner Order ID',
      className: 'min-w-0',
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
      cell: (_: any, rowData: any) => {
        const { merged_document, nium_order_id, e_sign_link, e_sign_status, e_sign_link_status } = rowData;

        // No action can be taken if there's no merged document
        if (merged_document === null) {
          return (
            <SignLinkButton
              id={nium_order_id}
              copyLinkUrl=""
              loading={false}
              toastInfoText=""
              disabled={true} // Disable button when no merged document exists
              tooltipText="No document available"
              buttonType="copy_link"
              buttonIconType="copy_link"
            />
          );
        }

        // Check if we need to generate a new link (no existing link or status requires regeneration)
        const needsGeneration =
          e_sign_link_status === 'expired' || e_sign_status === 'rejected' || e_sign_status === 'expired';

        // Button should be disabled if e-sign is completed and no regeneration is needed
        const isDisabled = e_sign_status === 'completed' && !needsGeneration;

        // Determine if loading state applies to this row
        const isLoading = isSendEsignLinkLoading && loadingOrderId === nium_order_id;

        // Set tooltip text based on whether we need generation or copy
        const tooltipText = needsGeneration ? 'Generate E Sign Link' : 'Copy E Sign Link';

        return (
          <SignLinkButton
            id={nium_order_id}
            copyLinkUrl={rowData.e_sign_link || ''}
            loading={isLoading}
            toastInfoText="E Sign link copied successfully!"
            disabled={isDisabled}
            {...(needsGeneration ? { onClick: () => handleRegenerateEsignLink(rowData) } : {})}
            tooltipText={tooltipText}
            buttonType={needsGeneration ? 'refresh' : 'copy_link'}
            buttonIconType={needsGeneration ? 'refresh' : 'copy_link'}
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
    // Create a local state to track if we've just generated a link
   
    
    const { v_kyc_status, e_sign_status, is_v_kyc_required, nium_order_id, v_kyc_link } = rowData;
    
    // Modify action needed to respect the local state
    const isActionNeeded =
      !hasGeneratedLink && // Don't show refresh button if we just generated a link
      is_v_kyc_required === true &&
      (v_kyc_status !== 'pending' || v_kyc_status !== 'completed' || v_kyc_status === 'rejected' || v_kyc_status === null) &&
      v_kyc_link === null;

    const isDisabled = v_kyc_status === 'completed' || v_kyc_status === 'N/A' || v_kyc_status === null ;

    // Determine tooltip text
    const tooltipText = isActionNeeded ? 'Generate VKYC Link' : is_v_kyc_required ? 'Copy VKYC Link' : '';

    // Determine if loading state applies to this row
    const isLoading = isSendVkycLinkLoading && loadingOrderId === nium_order_id;
    
    // Create wrapper function for regenerating link
    const handleGenerateLink = async () => {
      try {
        await handleRegenerateVkycLink(rowData);
        // When link generation is successful, update our local state
        setHasGeneratedLink(true);
      } catch (error) {
        console.error("Error generating VKYC link:", error);
      }
    };

    return (
      <SignLinkButton
        id={nium_order_id}
        copyLinkUrl={v_kyc_link || ''}
        loading={isLoading}
        toastInfoText="VKYC Link copied successfully!"
        disabled={isDisabled}
        {...(isActionNeeded ? { onClick: handleGenerateLink } : {})}
        tooltipText={tooltipText}
        buttonType={(isLoading || hasGeneratedLink) ? 'copy_link' : (isActionNeeded ? 'refresh' : 'copy_link')}
        buttonIconType={(isLoading || hasGeneratedLink) ? 'copy_link' : (isActionNeeded ? 'refresh' : 'copy_link')}
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
        <div className="flex gap-1">
          <TooltipActionButton
            onClick={() => navigate(`/maker/view-transaction?partner-order-id=${rowData.partner_order_id}&action=view`)}
            icon={<Eye size={16} />}
            tooltipText="view"
            variant="view"
          />
          <TooltipActionButton
            onClick={() => navigate(`/maker/edit-transaction?partner-order-id=${rowData.partner_order_id}&action=edit`)}
            icon={<Edit size={16} />}
            tooltipText="Edit"
            variant="edit"
          />
          <TooltipActionButton
            onClick={() =>
              navigate(`/maker/update-transaction?partner-order-id=${rowData.partner_order_id}&action=update`)
            }
            icon={<Upload size={16} />}
            tooltipText="Upload Document"
            variant="upload"
            disabled={rowData.merged_document !== null}
          />
          <TooltipActionButton
            onClick={() => handleDelete(rowData)}
            icon={<Trash2 size={16} />}
            tooltipText="Delete"
            variant="delete"
          />
        </div>
      ),
    },
  ];
};
