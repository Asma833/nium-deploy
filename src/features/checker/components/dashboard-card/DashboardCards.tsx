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
}

// Helper function to get card style based on title
const getCardStyle = (title: string) => {
  if (title.includes('Transaction')) {
    return {
      gradientFrom: 'from-purple-500/20',
      gradientTo: 'to-indigo-500/20',
      iconBg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      borderColor: 'border-purple-200/30',
      countColor: 'text-purple-700',
      tagBg: 'bg-purple-100',
      tagText: 'text-purple-700',
    };
  } else if (title.includes('VKYC')) {
    return {
      gradientFrom: 'from-blue-500/20',
      gradientTo: 'to-cyan-500/20',
      iconBg: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      borderColor: 'border-blue-200/30',
      countColor: 'text-blue-700',
      tagBg: 'bg-blue-100',
      tagText: 'text-blue-700',
    };
  } else {
    return {
      gradientFrom: 'from-amber-500/20',
      gradientTo: 'to-orange-500/20',
      iconBg: 'bg-gradient-to-r from-amber-600 to-orange-600',
      borderColor: 'border-amber-200/30',
      countColor: 'text-amber-700',
      tagBg: 'bg-amber-100',
      tagText: 'text-amber-700',
    };
  }
};

// Define status colors for different statuses
const statusColors: Record<string, string> = {
  Successful: 'bg-green-500',
  Approved: 'bg-green-500',
  Rejected: 'bg-red-500',
  Pending: 'bg-yellow-500',
};

const getStatusColor = (status: string) =>
  statusColors[status] || 'bg-blue-500';

const DashboardCard: React.FC<DashboardCardProps> = ({
  count,
  title,
  path,
  status,
  isLoading,
}) => {
  // const navigate = useNavigate();
  const cardStyle = getCardStyle(title);
  const statusDotColor = getStatusColor(status);

  // const handleNavigation = (status: string) => {
  //   if (status.includes("Successful") || status.includes("Approved")) {
  //     navigate("/checker/completed-transactions");
  //   } else if (status.includes("Rejected")) {
  //     navigate("/checker/viewall");
  //   } else if (status.includes("Pending")) {
  //     navigate("/checker/assign");
  //   } else {
  //     navigate("/checker/viewall");
  //   }
  // };

  return (
    <div className="dashboard-card">
      <div
        className={`relative h-full bg-gradient-to-br ${cardStyle.gradientFrom} ${cardStyle.gradientTo} backdrop-blur-lg  shadow-md`}
      >
        {/* Background accent circles */}
        <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-white/15 z-0"></div>
        <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-white/15 z-0"></div>

        {/* Category tag at top right */}
        <div className="absolute top-2 right-2 z-20">
          <span
            className={`text-xs ${cardStyle.tagBg} ${cardStyle.tagText} px-2 py-0.5 rounded-full inline-flex items-center`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusDotColor} mr-1`}
            ></span>
            {status}
          </span>
        </div>

        {/* Card content */}
        <div className="relative z-10 flex items-center h-full px-4 py-4">
          {/* Left: Icon/Image */}
          <div className="w-[50px] h-[50px] flex items-center justify-center overflow-hidden">
            <img
              src={path}
              alt={title}
              className="w-10 h-10 object-contain invert-in-dark"
            />
          </div>

          {/* Right: Text Content */}
          <div className="ml-4 flex-grow">
            <h2 className={`text-2xl font-semibold ${cardStyle.countColor}`}>
              {isLoading ? <Loader2 className="animate-spin" /> : count}
            </h2>

            <p className="text-sm text-[hsl(var(--text-p))]">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
