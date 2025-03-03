import { GeneralWrapperProps } from "@/components/types/generalTypes";
import { cn } from "@/utils/cn";

export const FormContentWrapper = ({
  children,
  className,
}: GeneralWrapperProps) => {
  return (
    <div
      className={cn("space-y-4 bg-card py-10 px-2 mt-4 rounded-md",className)}
    >
      {children}
    </div>
  );
};
