import { TransactionMode } from '@/types/enums';
import TransactionForm from '../../components/transaction-form/TransactionForm';

const UpdateDocTransaction = () => {
  return <TransactionForm mode={TransactionMode.UPDATE} />;
};

export default UpdateDocTransaction;
