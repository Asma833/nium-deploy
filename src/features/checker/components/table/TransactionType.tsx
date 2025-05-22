import { Order } from '../../types/updateIncident.type';

type Props = {
  rowData: Order;
};

const TransactionType = ({ rowData }: Props) => {
  const transactionTypeText =
    rowData?.transaction_type_name?.name || rowData?.transaction_type || '-';

  return <span>{transactionTypeText}</span>;
};

export default TransactionType;
