import _ from 'lodash';
import { Order } from '../../types/updateIncident.types';

const VKycStatusCell = ({ rowData }: { rowData: Order }) => {
  return (
    <span>
      {rowData.is_v_kyc_required ? (
        rowData.v_kyc_status && (
          <span
            className={`status-badge esign-${rowData.v_kyc_status.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {rowData.v_kyc_status === 'N/A'
              ? 'N/A'
              : _.capitalize(rowData.v_kyc_status)}
          </span>
        )
      ) : (
        <span>Not Required</span>
      )}
    </span>
  );
};

export default VKycStatusCell;
