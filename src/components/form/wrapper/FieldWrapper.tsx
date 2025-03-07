import React from "react";
import "./form-layout.css";
import { cn } from "@/utils/cn";

type PropsType = {
  children:React.ReactNode;
  className?: string;
  rowCols?: number | string;
  flexdirection?: string;
  error?: string;
};

const FieldWrapper = ({
  children,
  className = "",
  flexdirection,
  error,
  ...props
}: PropsType) => {
  return (
    <div
    {...props}
      className={cn(
        "fieldWrapper",
        className,
        flexdirection ? "flex-"+flexdirection  : "flex-col"
      )}
    >
      {children}
      {error && (
        <span className="text-sm text-[hsl(var(--destructive))]" >
          {error}
        </span>
      )}
    </div>
  );
};

export default FieldWrapper;
