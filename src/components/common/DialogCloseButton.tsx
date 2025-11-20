import { Button } from '../ui/button';
import { X } from 'lucide-react';

type Props = {
  onClick: () => void;
};

const DialogCloseButton = ({ onClick }: Props) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      aria-label="Close"
      className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
    >
      <X className="!w-[28px] !h-[28px] text-primary hover:opacity-95 outline-none font-bold" size={30} />
    </Button>
  );
};

export default DialogCloseButton;
