import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, Trash2, Eye, FileText, Video } from 'lucide-react';
import { SignLinkButton } from '@/components/common/SignLinkButton';
import TooltipActionButton from '@/components/common/TooltipActionButton';
import EsignStatusCell from '@/features/checker/components/table/EsignStatusCell';
import VKycStatusCell from '@/features/checker/components/table/VKycStatusCell';
import { formatDateWithFallback } from '@/utils/formatDateWithFallback';
import OrderStatusCell from '@/features/checker/components/table/OrderStatusCell';
import { ESIGN_STATUSES } from '@/features/checker/types/esignStatus';
import { ORDER_STATUSES } from '@/components/types/status';
import { ACTION_NEEDED_VKYC_STATUSES, DISABLED_VKYC_STATUSES } from '@/features/checker/types/vkycStatus';
import { maskPAN } from '@/utils/masking';

export const ViewStatusTableColumns = ({
  handleRegenerateEsignLink,
  handleRegenerateVkycLink,
  handleDelete,
  handleEkycStatus,
  handleVkycStatus,
  isSendVkycLinkLoading = false,
  isSendEsignLinkLoading = false,
  loadingOrderId = null,
}: {
  handleRegenerateEsignLink: (rowData: any) => void;
  handleRegenerateVkycLink: (rowData: any) => void;
  handleDelete: (rowData: any) => void;
  handleEkycStatus:(rowData: any) => void;
  handleVkycStatus:(rowData: any) => void;
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
      name: 'Order ID',
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
      cell: (value: string) => maskPAN(value),
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
      key: 'e_sign_status',
      id: 'e_sign_status',
      name: 'Esign Status',
      className: 'min-w-0 p-2',
      cell: (_: any, value: any) => <EsignStatusCell rowData={value} />,
    },
    {
      key: 'e_sign_link',
      id: 'e_sign_link',
      name: 'E Sign Link',
      className: 'min-w-0 p-2',
      cell: (_: any, rowData: any) => {
        const {
          merged_document,
          nium_order_id,
          e_sign_link,
          e_sign_status,
          e_sign_link_status,
          is_esign_required,
          order_status,
        } = rowData;

        // Check if order is deleted
        const isOrderDeleted = order_status === 'deleted';

        if (!merged_document || isOrderDeleted) {
          return (
            <SignLinkButton
              id={nium_order_id}
              copyLinkUrl=""
              loading={false}
              toastInfoText=""
              disabled
              tooltipText={isOrderDeleted ? 'Transaction is deleted' : 'No document available'}
              buttonType="copy_link"
              buttonIconType="copy_link"
            />
          );
        }

        const needsGeneration =
          e_sign_link_status === ESIGN_STATUSES.EXPIRED ||
          e_sign_status === ESIGN_STATUSES.EXPIRED ||
          e_sign_status === ESIGN_STATUSES.REJECTED ||
          !e_sign_link;

        const isDisabled =
          isOrderDeleted || // Add this condition
          e_sign_status === ESIGN_STATUSES.COMPLETED ||
          (e_sign_status === ESIGN_STATUSES.COMPLETED &&
            order_status === ORDER_STATUSES.REJECTED &&
            !needsGeneration) ||
          (is_esign_required && !e_sign_link && !needsGeneration);

        const isLoading = isSendEsignLinkLoading && loadingOrderId === nium_order_id;
        const tooltipText = isOrderDeleted
          ? 'Transaction is deleted'
          : needsGeneration
            ? 'Generate E Sign Link'
            : 'Copy E Sign Link';
        const buttonType = needsGeneration ? 'refresh' : 'copy_link';
        const buttonIconType = buttonType;

        return (
          <SignLinkButton
            id={nium_order_id}
            copyLinkUrl={e_sign_link || ''}
            loading={isLoading}
            toastInfoText="E Sign link copied successfully!"
            disabled={isDisabled}
            {...(needsGeneration && !isOrderDeleted ? { onClick: () => handleRegenerateEsignLink(rowData) } : {})}
            tooltipText={tooltipText}
            buttonType={buttonType}
            buttonIconType={buttonIconType}
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
        const { v_kyc_status, is_v_kyc_required, nium_order_id, v_kyc_link, order_status } = rowData;

        // Check if order is deleted
        const isOrderDeleted = order_status === 'deleted';

        const isActionNeeded = ACTION_NEEDED_VKYC_STATUSES.includes(v_kyc_status) || (is_v_kyc_required && !v_kyc_link);
        const isDisabled =
          isOrderDeleted || // Add this condition
          !is_v_kyc_required ||
          DISABLED_VKYC_STATUSES.includes(v_kyc_status) ||
          (is_v_kyc_required && !v_kyc_link && !isActionNeeded);

        const isLoading = isSendVkycLinkLoading && loadingOrderId === nium_order_id;
        const tooltipText = isOrderDeleted
          ? 'Transaction is deleted'
          : isActionNeeded
            ? 'Generate VKYC Link'
            : is_v_kyc_required
              ? 'Copy VKYC Link'
              : '';

        const handleGenerateLink = async () => {
          if (isOrderDeleted) return; // Prevent action if deleted

          try {
            await handleRegenerateVkycLink(rowData);
            setHasGeneratedLink(true);
          } catch (error) {
            console.error('Error generating VKYC link:', error);
          }
        };

        const buttonType = isLoading || hasGeneratedLink ? 'copy_link' : isActionNeeded ? 'refresh' : 'copy_link';

        return (
          <SignLinkButton
            id={nium_order_id}
            copyLinkUrl={v_kyc_link || ''}
            loading={isLoading}
            toastInfoText="VKYC Link copied successfully!"
            disabled={isDisabled}
            {...(isActionNeeded && !isOrderDeleted ? { onClick: handleGenerateLink } : {})}
            tooltipText={tooltipText}
            buttonType={buttonType}
            buttonIconType={buttonType}
          />
        );
      },
    },
    {
      key: 'order_status',
      id: 'order_status',
      name: 'Incident Status',
      className: 'min-w-0 p-2',
      cell: (_: any, value: any) => <OrderStatusCell rowData={value} />,
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
            onClick={() =>
              navigate(`/maker/update-transaction?partner-order-id=${rowData.partner_order_id}&action=update`)
            }
            icon={<Upload size={16} className="text-primary group-hover:text-white group-disabled:text-gray-400" />}
            tooltipText="Upload Document"
            variant="upload"
            disabled={rowData.merged_document !== null || rowData.order_status === ORDER_STATUSES.DELETED}
            className="group"
          />
          <TooltipActionButton
            onClick={() => handleDelete(rowData)}
            icon={<Trash2 size={16} />}
            tooltipText="Delete"
            variant="delete"
            disabled={rowData.merged_document !== null || rowData.order_status === ORDER_STATUSES.DELETED}
          />
            <TooltipActionButton
            onClick={() => handleEkycStatus(rowData)}
            icon={<FileText size={16} />}
            tooltipText="Get E-Sign Status"
            variant="esign"
             disabled={rowData.e_sign_status === 'pending' || rowData.e_sign_status === 'N/A'}
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
};
