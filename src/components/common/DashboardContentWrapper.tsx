import { cn } from '@/utils/cn';
import PageTitle from '../layout/titles/PageTitle';
import { DashboardContentWrapperProps } from '../types/common-components.types';
import PoweredBy from '../layout/footer/PoweredBy';

const DashboardContentWrapper = ({
  children,
  className,
}: DashboardContentWrapperProps) => {
  return (
    <div
      className={cn(
        'w-full flex flex-col justify-between items-center px-4 pt-6 pb-2 sm:px-6 lg:px-6 bg-secondary min-h-[calc(100vh-70px)]',
        className
      )}
    >
      <div className="w-full flex flex-col items-center">{children}</div>
      <PoweredBy />
    </div>
  );
};

export default DashboardContentWrapper;
