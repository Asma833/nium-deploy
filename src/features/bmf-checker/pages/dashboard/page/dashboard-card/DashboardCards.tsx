import React from "react";

interface DashboardCardProps {
  icon: React.ElementType;
  count: number;
  title: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon: Icon, count, title }) => {
  return (
    <div className="bg-white shadow-md rounded-lg flex items-center px-4 py-4 w-full  h-[120px]">
      {/* Left: Icon */}
      <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-gray-100">
        <Icon className="w-8 h-8 text-gray-700" />
      </div>

      {/* Right: Text Content */}
      <div className="ml-4">
        <h2 className="text-2xl font-semibold">{count.toLocaleString()}</h2>
        <p className="text-gray-500 text-sm">{title}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
