import React from "react";
import BreadCrumb from "./BreadCrumb";
import { cn } from "@/utils/cn";

type Props = {
    children: React.ReactNode;
    className?: string;
};

const DashboardContentWrapper = ({children, className}: Props) => {
  return (
    <div className={cn("w-full px-4 pt-6 sm:px-6 lg:px-10 bg-secondary min-h-[calc(100vh-150px)]", className)}>
      <BreadCrumb />
      {children}
    </div>
  );
};

export default DashboardContentWrapper;
