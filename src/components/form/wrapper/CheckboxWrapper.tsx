import { cn } from "@/utils/cn";
import FormHelperText from "@mui/material/FormHelperText";

type Props = {
  children: React.ReactNode;
  label?: string;
  id?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
};

export default function CheckboxWrapper({
  children,
  label,
  id,
  className,
  error,
}: Props) {

  // console.log("error>>>>>>>>", error);
  
  return (
    <div className="flex flex-col space-y-2">
      <div
        className={cn(
          "flex flex-row items-direction-row items-center space-x-2",
          className
        )}
      >
        {id && (
          <label
            htmlFor={id}
            className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}

        {children}
      </div>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  );
}
