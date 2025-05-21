import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardCardProps {
  count: number;
  title: string;
  path: string;
  icon?: React.ComponentType;
  id?: number;
  status: string;
  isLoading?: boolean;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  count,
  title,
  path,
  status,
  isLoading,
  className,
}) => {
  return (
    <div className={cn('dashboard-card', className)}>
      {/* Card content */}
      <div className="relative z-10 flex items-center w-full h-full">
        {/* Left: Icon/Image */}
        <div className="w-[50px] h-[50px] flex flex-1 items-center justify-center">
          <img
            src={path}
            alt={title}
            className="w-16 h-16 object-contain invert-in-dark"
          />
        </div>

        {/* Right: Text Content */}
        <div className="ml-4 flex-1">
          <h2 className="text-[35px] text-left">
            {isLoading ? <Loader2 className="animate-spin" /> : count}
          </h2>

          <p className="text-md font-semibold text-[hsl(var(--text-p))] text-left">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
