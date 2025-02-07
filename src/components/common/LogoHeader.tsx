import { cn } from "@/utils/cn";
import { ThemeToggle } from "../ThemeToggle";
import Logo from "../logo/logo";

type Props = {
  className?: string;
};

const LogoHeader = ({ className }: Props) => {
  return (
    <div
      className={cn("w-full flex justify-between items-center p-4", className)}
    >
      <ThemeToggle />
      <div className="flex justify-center">
        <Logo className="invert-in-dark" />
      </div>
    </div>
  );
};

export default LogoHeader;
