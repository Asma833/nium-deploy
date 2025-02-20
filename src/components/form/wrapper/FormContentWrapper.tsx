import { GeneralWrapperProps } from "@/components/types/generalTypes";
import { cn } from "@/utils/cn";

export const FormContentWrapper = ({
  children,
  className,
}: GeneralWrapperProps) => {
  return (
    <div
      className={cn(className, "space-y-4 bg-card p-10 mt-4 rounded-md")}
    >
      {children}
    </div>
  );
};
