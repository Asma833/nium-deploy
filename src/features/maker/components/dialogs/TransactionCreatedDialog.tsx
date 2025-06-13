import { DialogWrapper } from '@/components/common/DialogWrapper';
import { TransactionCreatedDialogProps } from '../../types/create-transaction.types';

const TransactionCreatedDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  createdTransactionId,
  niumForexOrderId,
  isSubmitting = false,
}: TransactionCreatedDialogProps) => {
  return (
    <DialogWrapper
      isOpen={isDialogOpen}
      setIsOpen={setIsDialogOpen}
      renderContent={
        <div className="flex flex-col justify-center items-center gap-4 text-lg min-h-[200px] text-gray-700">
          {/* <Check className="text-primary font-extrabold w-12 h-12 border rounded-full p-1" /> */}
          <div className="text-center space-y-2">
            <div>
              <span className="text-gray-600">Partner Order ID: </span>
              <span className="font-bold text-dark">{createdTransactionId}</span>
            </div>
            <div>
              <span className="text-gray-600">Nium Forex Order ID: </span>
              <span className="font-bold text-dark">{niumForexOrderId}</span>
            </div>
            <div className="text-green-600 font-medium mt-4">Order created successfully!</div>
          </div>
        </div>
      }
      showFooter={false}
      showHeader={false}
      isLoading={isSubmitting}
      iconType="default"
      triggerBtnClassName="bg-custom-primary text-white hover:bg-custom-primary-hover"
      className="sm:max-w-[80%] md:max-w-[50%] w-full max-h-[90%] overflow-auto"
    />
  );
};

export default TransactionCreatedDialog;
