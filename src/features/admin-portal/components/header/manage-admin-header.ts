export interface DropdownItem {
  title: string;
  path: string;
}

export interface NavItem {
  title: string;
  path?: string;
  dropdown?: DropdownItem[];
}

const userPrefix = "/admin";


export const AdminNavItems = [
  { title: "Dashboard", path: `${userPrefix}/dashboard` },
  {
    title: "User Management",
    dropdown: [
      { title: "N-User", path: `${userPrefix}/n-user`, description: "Create, Update, Delete N-User" },
      { title: "Agent Profile Creation", path: `${userPrefix}/agents`, description: "Create, Update, Delete Agent Profile" },
      {
        title: "Agent Branch User Creation",
        path: `${userPrefix}/user-management/agent-branch-user-creation`,
        description: "Create, Update, Delete Agent Branch User",
      },
    ],
  },
  {
    title: "Master",
    dropdown: [
      { title: "Rate Master", path: `${userPrefix}/rate-master` },
      { title: "Purpose Master", path: `${userPrefix}/purpose-master` },
      { title: "TCS Master", path: `${userPrefix}/tcs-master` },
    ],
  },
  {
    title: "Commission",
    dropdown: [
      { title: "Structure", path: `${userPrefix}/commission-structure` },
      { title: "Payment", path: `${userPrefix}/commission-payment` },
    ],
  },
  { title: "Support", path: `${userPrefix}/support` },
  { title: "Create Company", path: `${userPrefix}/create-company` },
  { title: "Agent Report", path: `${userPrefix}/agent-report` },
];
