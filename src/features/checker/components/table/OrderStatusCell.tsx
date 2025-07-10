import { ORDER_STATUS_CLASSNAMES, ORDER_STATUS_LABELS, ORDER_STATUSES } from '@/components/types/status';
import { Order } from '../../types/updateIncident.types';
import _ from 'lodash';

type Props = {
  rowData: Order;
};

const OrderStatusCell = ({ rowData }: Props) => {
  const rawStatus = _.toLower(String(rowData.order_status || '')) || ORDER_STATUSES.PENDING;

  const isKnownStatus = rawStatus in ORDER_STATUS_LABELS;

  const statusKey = isKnownStatus ? rawStatus : ORDER_STATUSES.PENDING;

  return <span className={ORDER_STATUS_CLASSNAMES[statusKey]}>{ORDER_STATUS_LABELS[statusKey]}</span>;
};

export default OrderStatusCell;
