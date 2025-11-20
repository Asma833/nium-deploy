import { cn } from '@/utils/cn';
import '../styles/form-layout.css';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Spacer = ({ children, className }: Props) => {
  return <div className={cn('flex flex-col gap-[30px]', className)}>{children}</div>;
};

export default Spacer;
