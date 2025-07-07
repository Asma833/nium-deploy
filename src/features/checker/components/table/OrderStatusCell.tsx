import _ from 'lodash';
import { Order } from '../../types/updateIncident.types';

const OrderStatusCell = ({ rowData }: { rowData: Order }) => {
  return (
    <span>
      {!rowData.order_status ? (
        <span className="status-badge pending">Pending</span>
      ) : rowData.order_status === 'pending' ? (
        <span className="status-badge pending">Pending</span>
      ) : rowData.order_status === 'completed' ? (
        <span className="status-badge approved">Approved</span>
      ) : (
        <span className="status-badge rejected">Rejected</span>
      )}
    </span>
  );
};

export default OrderStatusCell;
