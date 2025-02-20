import { cn } from "@/utils/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Spacer = ({ children, className }: Props) => {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
};

export default Spacer;
