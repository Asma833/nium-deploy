import _ from 'lodash';
import { Order } from '../../types/updateIncident.types';

const EsignStatusCell = ({ rowData }: { rowData: Order }) => {
  console.log('EsignStatusCell rowData:', rowData);
  return (
    <span>
      {rowData.is_esign_required ? (
        rowData.e_sign_status && (
          <span className={`status-badge esign-${rowData.e_sign_status.toLowerCase().replace(/\s+/g, '-')}`}>
            {rowData.e_sign_status === 'N/A' ? 'N/A' : _.capitalize(rowData.e_sign_status)}
          </span>
        )
      ) : (
        <span className="status-badge na text-nowrap">Not Required</span>
      )}
    </span>
  );
};

export default EsignStatusCell;
