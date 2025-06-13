import TransactionForm from '../../components/transaction-form/TransactionForm';
import { TransactionMode } from '../../components/transaction-form/transaction-form.types';

const ViewTransaction = () => {
  return <TransactionForm mode={TransactionMode.VIEW} />;
};

export default ViewTransaction;
