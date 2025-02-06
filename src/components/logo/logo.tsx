import Image from "../common/Image";
import logoUrl from "@/assets/images/nium-logo.svg";

type Props = {
  width?: number;
  height?: number;
};

const Logo = ({ width = 120, height = 120 }: Props) => {
  return (
    <Image
      src={logoUrl}
      alt="Logo"
      width={width}
      height={height}
      loading="eager"
      priority
    />
  );
};

export default Logo;
