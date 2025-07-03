import { Order } from '../../types/updateIncident.types';

const IncidentStatusCell = ({ rowData }: { rowData: Order }) => {
  const status = rowData.order_status;

  return (
    <span>
      {!status || status === 'pending' ? (
        <span className="status-badge pending">Pending</span>
      ) : status === 'approved' ? (
        <span className="status-badge approved">Approved</span>
      ) : (
        <span className="status-badge rejected">Rejected</span>
      )}
    </span>
  );
};

export default IncidentStatusCell;
