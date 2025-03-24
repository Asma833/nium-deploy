import Image from "../common/Image";
import logoUrl from "@/assets/images/nium-logo.svg";

type Props = {
  width?: number;
  height?: number;
  className?: string;
};

const Logo = ({ width = 80, height = 120, className }: Props) => {
  return (
    <Image
      src={logoUrl}
      alt="Logo"
      width={width}
      height={height}
      loading="eager"
      className={className || ''}
    />
  );
};

export default Logo;
