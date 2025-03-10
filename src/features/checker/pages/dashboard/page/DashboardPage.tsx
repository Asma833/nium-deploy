import { dashboardData } from "./dashboard-card/card";
import DashboardCard from "./dashboard-card/DashboardCards";


const DashboardPage = () => {
    return <div className="py-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {dashboardData.map((item) => (
      <DashboardCard key={item.id} icon={item.icon} count={item.count} title={item.title} />
    ))}
  </div>
  };
  
export default DashboardPage;
  