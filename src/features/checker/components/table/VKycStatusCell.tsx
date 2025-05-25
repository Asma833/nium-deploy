import _ from 'lodash';
import { Order } from '../../types/updateIncident.types';

const VKycStatusCell = ({ rowData }: { rowData: Order }) => {
  return (
    <span>
      {rowData.is_esign_required ? (
        rowData.v_kyc_status && (
          <span
            className={`status-badge esign-${rowData.v_kyc_status.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {_.capitalize(rowData.v_kyc_status)}
          </span>
        )
      ) : (
        <span>NA</span>
      )}
    </span>
  );
};

export default VKycStatusCell;
