import { OrderRowData } from '../../types/updateIncident.types';

const TransactionType = ({ rowData }: OrderRowData) => {
  const transactionTypeText =
    rowData?.transaction_type_name?.name || rowData?.transaction_type || 'N/A';

  return <span>{transactionTypeText}</span>;
};

export default TransactionType;
