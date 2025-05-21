import React from "react";

interface DashboardCardProps {
  count: number;
  title: string;
  path:string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ count, title,path }) => {
  return (
    <div className="ease-linear flex items-center px-4 py-4 w-full  h-[120px] border-2 border-gray-300 rounded-lg  hover:shadow-lg transition duration-300">
      {/* Left: Icon */}
      <div className="w-[50px] h-[50px] flex items-center justify-center">
        <img src={path}/>
      </div>

      {/* Right: Text Content */}
      <div className="ml-4">
        <h2 className="text-2xl font-semibold">{count}</h2>
        <p className="text-sm ">{title}</p>
      </div>
    </div>
  );
};

export default DashboardCard;