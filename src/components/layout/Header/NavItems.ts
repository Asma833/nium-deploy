
export interface DropdownItem {
  title: string;
  path: string;
}

export interface NavItem {
  title: string;
  path?: string;
  dropdown?: DropdownItem[];
}


  export const defaultNavItems: NavItem[] = [
    { title: "Dashboard", path: "/dashboard" },
    {
      title: "User Management",
      dropdown: [
        { title: "N-User", path: "/agents" },
        { title: "Agent Profile Creation", path: "/agents" },
        { title: "Agent Branch User Creation", path: "/branch-user" },
      ],
    },
    {
      title: "Master",
      dropdown: [
        { title: "Rate Master", path: "/rate-master" },
        { title: "Purpose Master", path: "/purpose-master" },
        { title: "TCS Master", path: "/tcs-master" },
      ],
    },
    {
      title: "Commission",
      dropdown: [
        { title: "Structure", path: "/commission-structure" },
        { title: "Payment", path: "/commission-payment" },
      ],
    },
    { title: "Support", path: "/support" },
    { title: "Create Company", path: "/create-company" },
    { title: "Agent Report", path: "/agent-report" },
  ];