import TransactionForm from '../../components/transaction-form/TransactionForm';
import { TransactionMode } from '../../components/transaction-form/transaction-form.types';

const CreateTransaction = () => {
  return <TransactionForm mode={TransactionMode.CREATE} />;
};

export default CreateTransaction;
