import { cn } from "@/utils/cn";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const FlexStartRow = ({ children, className }: Props) => {
  return <div className={cn("flex justify-start w-full", className)}>{children}</div>;
};

export default FlexStartRow;
