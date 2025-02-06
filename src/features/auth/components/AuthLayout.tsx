import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/logo/logo";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
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
      <div className="w-full flex justify-between items-center p-4">
        <ThemeToggle />
        <div className="flex justify-center">
          <Logo />
        </div>
      </div>
      <div className="h-full w-full flex items-center justify-between flex-1 bg-secondary">
        <div className="max-w-md mx-auto w-full border-2 border-gray-200 p-5 rounded-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
