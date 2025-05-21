import _ from 'lodash';
import { Order } from '../../types/updateIncident.type';

const IncidentStatusCell = ({ rowData }: { rowData: Order }) => {
  return (
    <span>
      {rowData.incident_status === null ||
      rowData.incident_status === undefined ? (
        <span className="status-badge pending">Pending</span>
      ) : rowData.incident_status ? (
        <span className="status-badge approved">Approved</span>
      ) : (
        <span className="status-badge rejected">Rejected</span>
      )}
    </span>
  );
};

export default IncidentStatusCell;
