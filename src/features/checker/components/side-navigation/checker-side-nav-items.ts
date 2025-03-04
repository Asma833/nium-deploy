
const userPrefix = "/checker";

import { LayoutDashboard, ClipboardList, FileEdit, Eye, CreditCard } from "lucide-react";

export const CheckerSideNavItems = [
  { title: "Dashboard", path: `${userPrefix}/dashboard`, icon: LayoutDashboard },
  { title: "Assign", path: `${userPrefix}/assign`, icon: ClipboardList }, 
  { title: "Update Incident", path: `${userPrefix}/updateIncident`, icon: FileEdit }, 
  { title: "View All", path: `${userPrefix}/viewall`, icon: Eye }, 
  { title: "Transactions", path: `${userPrefix}/completedtransactions`, icon: CreditCard } 
];
