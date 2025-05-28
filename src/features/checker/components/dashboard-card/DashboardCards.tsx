import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { DashboardCardProps } from '../../types/checker.types';

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
        <div className="flex flex-1 items-center justify-start pl-2">
          <img
            src={path}
            alt={title}
            className="w-14 h-14 object-contain invert-in-dark"
          />
        </div>

        {/* Right: Text Content */}
        <div className="flex-1 leading-tight">
          <h2 className="text-[35px] text-left">
            {isLoading ? <Loader2 className="animate-spin" /> : count}
          </h2>

          <p className="text-sm font-semibold text-[hsl(var(--text-p))] text-left">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
