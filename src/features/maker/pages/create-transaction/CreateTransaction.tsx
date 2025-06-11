import CreateTransactionForm from '../../components/transaction-form/CreateTransactionForm';
import { TransactionMode } from '../../components/transaction-form/transaction-form.types';

type Props = {};

const CreateTransaction = (props: Props) => {
  return <CreateTransactionForm mode={TransactionMode.CREATE} />;
};

export default CreateTransaction;
