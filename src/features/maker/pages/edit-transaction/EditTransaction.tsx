import TransactionForm from '../../components/transaction-form/TransactionForm';
import { TransactionMode } from '../../components/transaction-form/transaction-form.types';

const UpdateTransaction = () => {
  return <TransactionForm mode={TransactionMode.EDIT} />;
};

export default UpdateTransaction;
