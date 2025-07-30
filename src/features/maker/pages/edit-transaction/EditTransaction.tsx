import { TransactionMode } from '@/types/enums';
import TransactionForm from '../../components/transaction-form/TransactionForm';

const UpdateTransaction = () => {
  return <TransactionForm mode={TransactionMode.EDIT} />;
};

export default UpdateTransaction;
