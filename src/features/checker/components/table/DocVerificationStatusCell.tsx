import _ from 'lodash';
import { Order } from '../../types/updateIncident.types';

const DocVerificationStatusCell = ({ rowData }: { rowData: Order }) => {
  const esignStatus =
    rowData.is_esign_required && rowData.e_sign_status
      ? rowData.e_sign_status === 'approved' || rowData.e_sign_status === 'completed'
        ? 'approved'
        : rowData.e_sign_status === 'rejected'
          ? 'rejected'
          : 'pending'
      : 'not required';
  const vkycStatus =
    rowData.is_v_kyc_required && rowData.v_kyc_status
      ? rowData.v_kyc_status === 'approved' || rowData.v_kyc_status === 'completed'
        ? 'approved'
        : rowData.v_kyc_status === 'rejected'
          ? 'rejected'
          : 'pending'
      : 'not required';
  const incidentStatus =
    rowData.incident_status === null ? 'pending' : rowData.incident_status ? 'approved' : 'rejected';

  // Determine the overall status based on the priority: rejected > pending > approved
  const determineOverallStatus = (...statuses: string[]) => {
    const relevantStatuses = statuses.filter((status) => status !== 'not required');

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
    <span className={`status-badge ${docVerificationStatus.toLowerCase().replace(/\s+/g, '-')}`}>
      {_.capitalize(docVerificationStatus)}
    </span>
  );
};

export default DocVerificationStatusCell;
