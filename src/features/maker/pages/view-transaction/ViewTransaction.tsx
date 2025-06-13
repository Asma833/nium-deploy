import CreateTransactionForm from '../../components/transaction-form/CreateTransactionForm';
import { TransactionMode } from '../../components/transaction-form/transaction-form.types';

type Props = {};

const ViewTransaction = (props: Props) => {
  return <CreateTransactionForm mode={TransactionMode.VIEW} />;
};

export default ViewTransaction;
