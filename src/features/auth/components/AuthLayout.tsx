import { useEffect, useState } from "react";
import LogoHeader from "@/components/common/LogoHeader";

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
    <div className="min-h-screen w-full flex flex-col justify-start">
      <LogoHeader />
      <div className="h-full w-full flex items-center justify-between flex-1 bg-secondary">
        <div className="max-w-md mx-auto w-full bg-background border-2 border-gray-200 p-5 rounded-xl">
          <h1 className="text-2xl font-semibold mb-3">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
