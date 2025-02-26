import { CheckCircle, XCircle, MoreHorizontal, FileCheck2, FileX, FileClock } from "lucide-react";

export interface DashboardItem {
  id: number;
  title: string;
  count: number;
  icon: React.ComponentType; // Store icon as a component reference
}

export const dashboardData: DashboardItem[] = [
  { id: 1, title: "Transaction Received", count: 3100, icon: FileCheck2 },
  { id: 2, title: "Transaction Approved", count: 900, icon: CheckCircle },
  { id: 3, title: "Transaction Rejected", count: 3100, icon: XCircle },
  { id: 4, title: "Transaction Pending", count: 1100, icon: MoreHorizontal },
  { id: 5, title: "VKYC Completed", count: 1800, icon: FileCheck2 },
  { id: 6, title: "VKYC Pending", count: 800, icon: FileClock },
  { id: 7, title: "VKYC Rejected", count: 800, icon: FileX },
  { id: 8, title: "Esign Completed", count: 500, icon: FileCheck2 },
  { id: 9, title: "Esign Pending", count: 50, icon: FileClock },
  { id: 10, title: "Esign Rejected", count: 200, icon: FileX },
];
