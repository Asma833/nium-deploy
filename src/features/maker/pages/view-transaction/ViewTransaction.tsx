import { TransactionMode } from '@/types/enums';
import TransactionForm from '../../components/transaction-form/TransactionForm';

const ViewTransaction = () => {
  return <TransactionForm mode={TransactionMode.VIEW} />;
};

export default ViewTransaction;
