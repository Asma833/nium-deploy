import { Image } from '@/components/ui/image';
import dataseedLogo from '@/assets/images/poweredby-dataseed-logo.svg';

const PoweredBy = () => {
  return (
    <div className="flex justify-center items-center mt-16 mb-5">
      <a href="https://dataseedtech.com/" target="_blank" rel="noopener noreferrer">
        <Image src={dataseedLogo} width={160} height={80} alt="Powered by Dataseed" />
      </a>
    </div>
  );
};

export default PoweredBy;
