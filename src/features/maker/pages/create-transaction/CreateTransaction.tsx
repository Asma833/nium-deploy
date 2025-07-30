import { TransactionMode } from '@/types/enums';
import TransactionForm from '../../components/transaction-form/TransactionForm';

const CreateTransaction = () => {
  return <TransactionForm mode={TransactionMode.CREATE} />;
};

export default CreateTransaction;
