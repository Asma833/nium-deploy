import { useEffect, useState } from 'react';
import LogoHeader from '@/components/common/LogoHeader';
import PoweredBy from './footer/PoweredBy';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-start bg-secondary">
      <LogoHeader />
      <div className="h-full w-full flex items-center justify-between flex-1">
        <div className="max-w-md mx-auto w-full p-5 rounded-xl">
          <h1 className="text-2xl font-semibold mb-3">{title}</h1>
          {children}
        </div>
      </div>
      <PoweredBy />
    </div>
  );
};

export default AuthLayout;
