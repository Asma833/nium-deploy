import { Image } from "@/components/ui/image";
import dataseedLogo from '@/assets/images/poweredby-dataseed-logo.svg';


const PoweredBy = () => {
  return (
    <div className="flex justify-center items-center mt-16 mb-5">
      <Image src={dataseedLogo} width={160} height={80} />
    </div>
  );
};

export default PoweredBy;
