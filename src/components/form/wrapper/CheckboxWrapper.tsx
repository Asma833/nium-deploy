import { cn } from "@/utils/cn";

type Props = {
  children: React.ReactNode;
  label?: string;
  id: string;
  className?: string;
};

export default function CheckboxWrapper({
  children,
  label,
  id,
  className,
}: Props) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
