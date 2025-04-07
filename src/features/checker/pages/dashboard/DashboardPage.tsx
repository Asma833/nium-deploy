import React, { useEffect } from 'react';
import { createDashboardData } from '../../config/card.config';
import DashboardCard from '../../components/dashboard-card/DashboardCards';
import { useGetDashboardCardMetrics } from '@/features/checker/hooks/useGetDashboardCardMatrics';
import { usePageTitle } from '@/hooks/usePageTitle';

export const Dashboard: React.FC = () => {
  const { data: metrics, isLoading, error } = useGetDashboardCardMetrics();
  const { setTitle } = usePageTitle();
  // Generate dashboard items using the fetched metrics
  const dashboardItems = createDashboardData(metrics);

  useEffect(() => {
    setTitle('Dashboard');
  }, [setTitle]);

  return (
    <>
      {error && (
        <span className="text-red-500">
          {error ? 'Something went wrong' : ''}
        </span>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
