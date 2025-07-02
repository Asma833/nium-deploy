import _ from 'lodash';
import { Order } from '../../types/updateIncident.types';

const IncidentStatusCell = ({ rowData }: { rowData: Order }) => {
  return (
    <span>
      {rowData.order_status === null || rowData.order_status === undefined || rowData.order_status === false ? (
        <span className="status-badge pending">Pending</span>
      ) : rowData.order_status === 'pending' ? (
        <span className="status-badge pending">Pending</span>
      ) : rowData.order_status === 'approved' ? (
        <span className="status-badge approved">Approved</span>
      ) : (
        <span className="status-badge rejected">Rejected</span>
      )}
    </span>
  );
};

export default IncidentStatusCell;
