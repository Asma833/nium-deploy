import { useEffect } from "react";
import { dashboardData } from "./dashboard-card/card";
import DashboardCard from "./dashboard-card/DashboardCards";
import { usePageTitle } from "@/components/common/PageTitle";

const DashboardPage = () => {
  const { setTitle } = usePageTitle();
  
  useEffect(() => {
    setTitle("Dashboard");
  }, [setTitle]);
  

  
    return(
    <>
    <div className="px-2">
    <p className="font-bold">Overview</p>
    <p className="mb-4 mt-0">Monitor your transaction statuses and verification processes</p>

    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {dashboardData.map((item) => (
      <DashboardCard key={item.id} id={item.id} status={item.status} path={item.path} count={item.count} title={item.title} />
    ))}
  </div>
  </div>
  </>
    )
  };
  
export default DashboardPage;
  