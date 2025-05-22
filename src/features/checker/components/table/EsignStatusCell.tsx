import _ from 'lodash';
import { Order } from '../../types/updateIncident.type';

const EsignStatusCell = ({ rowData }: { rowData: Order }) => {
  return (
    <span>
      {rowData.is_esign_required ? (
        rowData.e_sign_status && (
          <span
            className={`status-badge esign-${rowData.e_sign_status.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {_.capitalize(rowData.e_sign_status)}
          </span>
        )
      ) : (
        <span>NA</span>
      )}
    </span>
  );
};

export default EsignStatusCell;
