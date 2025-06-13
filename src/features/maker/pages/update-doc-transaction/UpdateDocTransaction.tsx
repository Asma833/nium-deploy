import TransactionForm from '../../components/transaction-form/TransactionForm';
import { TransactionMode } from '../../components/transaction-form/transaction-form.types';

const UpdateDocTransaction = () => {
  return <TransactionForm mode={TransactionMode.UPDATE} />;
};

export default UpdateDocTransaction;
