import { cn } from '@/utils/cn';

const NiumOrderID = ({
  rowData,
  openModal,
  className = '',
}: {
  rowData: any;
  openModal?: (value: string) => void;
  className?: string;
}) => {
  const handleOpenModal = () => {
    if (openModal) {
      openModal(rowData);
    }
  };
  return (
    <button
      className={cn(
        'w-full text-primary cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50',
        openModal ? 'underline' : '',
        className
      )}
      onClick={handleOpenModal}
    >
      {rowData.nium_order_id}
    </button>
  );
};

export default NiumOrderID;
