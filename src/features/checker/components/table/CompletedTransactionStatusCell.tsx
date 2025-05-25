import _ from 'lodash';
import { Order } from '../../types/updateIncident.types';

const CompletedTransactionStatusCell = ({ rowData }: { rowData: Order }) => {
  const {
    e_sign_status,
    is_esign_required,
    v_kyc_status,
    is_v_kyc_required,
    incident_status,
  } = rowData;

  const esignStatus =
    is_esign_required && e_sign_status
      ? e_sign_status === 'approved' || e_sign_status === 'completed'
        ? 'approved'
        : e_sign_status === 'rejected'
          ? 'rejected'
          : 'pending'
      : 'not required';

  const vkycStatus =
    is_v_kyc_required && v_kyc_status
      ? v_kyc_status === 'approved' || v_kyc_status === 'completed'
        ? 'approved'
        : v_kyc_status === 'rejected'
          ? 'rejected'
          : 'pending'
      : 'not required';

  const incidentStatus =
    incident_status === null
      ? 'pending'
      : incident_status
        ? 'approved'
        : 'rejected';

  // Determine the overall status based on the priority: rejected > pending > approved
  const determineOverallStatus = (...statuses: string[]) => {
    const relevantStatuses = statuses.filter(
      (status) => status !== 'not required'
    );

    if (relevantStatuses.length === 0) return 'pending';
    if (relevantStatuses.includes('rejected')) return 'rejected';
    if (relevantStatuses.includes('pending')) return 'pending';
    return 'approved';
  };

  const docVerificationStatus =
    esignStatus === 'not required' && vkycStatus === 'not required'
      ? incidentStatus
      : determineOverallStatus(esignStatus, vkycStatus, incidentStatus);
  return (
    <span
      className={`status-badge ${docVerificationStatus.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {_.capitalize(docVerificationStatus)}
    </span>
  );
};

export default CompletedTransactionStatusCell;
