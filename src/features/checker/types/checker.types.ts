export type DashboardMetrics = {
  transactionReceived: number;
  transactionApproved: number;
  transactionRejected: number;
  transactionPending: number;
  vkycCompleted: number;
  vkycPending: number;
  vkycRejected: number;
  esignCompleted: number;
  esignPending: number;
  esignRejected: number;
};

export type UnassignCheckerParams = {
  orderId: string;
  checkerId: string;
};

export type DashboardItem = {
  id: number;
  title: string;
  count: number;
  icon: React.ComponentType;
  path: string;
  status: string;
};

export type DashboardCardProps = {
  count: number;
  title: string;
  path: string;
  icon?: React.ComponentType;
  id?: number;
  status: string;
  isLoading?: boolean;
  className?: string;
}



