import { GeneralWrapperProps } from '@/components/types/common-components.types';
import { cn } from '@/utils/cn';

export const FormContentWrapper = ({ children, className }: GeneralWrapperProps) => {
  return <div className={cn('space-y-4 bg-card mt-4 rounded-md', className)}>{children}</div>;
};
