import BreadCrumb from "./BreadCrumb";
import { cn } from "@/utils/cn";
import { DashboardContentWrapperProps } from './common-components.types';

const DashboardContentWrapper = ({children, className}: DashboardContentWrapperProps) => {
  return (
    <div className={cn("w-full px-4 pt-6 sm:px-6 lg:px-10 bg-secondary min-h-[calc(100vh-150px)]", className)}>
      <BreadCrumb />
      {children}
    </div>
  );
};

export default DashboardContentWrapper;
