import LogoutButton from "@/features/auth/components/LogoutButton";
import { Fragment } from "react";

type Props = {};

const Dashboard = (props: Props) => {
  return (
    <Fragment>
      <div>Dashboard</div>
      <div className="w-20">
        <LogoutButton variant="primary" showIcon={false} className="w-full" />
      </div>
    </Fragment>
  );
};

export default Dashboard;
