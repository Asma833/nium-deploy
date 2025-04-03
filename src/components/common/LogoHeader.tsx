import { cn } from "@/utils/cn";
import Logo from "../logo/logo";
import { ThemeToggle } from "./ThemeToggle";
import { CommonProps } from "./common-components.types";

const LogoHeader = ({ className }: CommonProps) => {
  return (
    <div
      className={cn(
        "w-full h-[80px] flex justify-between items-center p-4",
        className
      )}
    >
      <ThemeToggle />
      <div className="flex justify-center">
        <Logo className="invert-in-dark" />
      </div>
    </div>
  );
};

export default LogoHeader;
