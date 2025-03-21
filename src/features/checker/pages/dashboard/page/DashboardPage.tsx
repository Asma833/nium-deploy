import React from "react";
import { createDashboardData } from "./dashboard-card/card";
import DashboardCard from "./dashboard-card/DashboardCards";
import { useGetDashCardMetrics } from "@/features/checker/hooks/useGetDashCardMatrics";

export const Dashboard: React.FC = () => {
  const { data: metrics, isLoading, error } = useGetDashCardMetrics();
 
  // Generate dashboard items using the fetched metrics
  const dashboardItems = createDashboardData(metrics);


  return (
    <>
      {error && <span className="text-red-500">{error ? "Something went wrong" : ""}</span>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {dashboardItems.map((item) => (
          <DashboardCard
            key={item.id}
            id={item.id}
            status={item.status}
            path={item.path}
            count={item.count}
            title={item.title}
            isLoading={isLoading}
          />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
