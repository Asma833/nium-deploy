import CreateTransactionForm from '../../components/transaction-form/CreateTransactionForm';
import { TransactionMode } from '../../components/transaction-form/transaction-form.types';

type Props = {};

const UpdateTransaction = (props: Props) => {
  return <CreateTransactionForm mode={TransactionMode.UPDATE} />;
};

export default UpdateTransaction;
