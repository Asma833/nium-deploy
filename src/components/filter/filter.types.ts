export interface TableSearchFilterProps {
  filters: {
    search: string;
    status: string;
    role: string;
    dateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
    customFilterValues: Record<string, string>;
  };

  setFilters: React.Dispatch<
    React.SetStateAction<{
      search: string;
      status: string;
      role: string;
      dateRange: {
        from: Date | undefined;
        to: Date | undefined;
      };
      customFilterValues: Record<string, string>;
    }>
  >;

  onFilter: () => void;
  onReset: () => void;
  filterConfig: {
    filterOption: boolean;
    rederFilerOptions: {
      search?: boolean;
      status?: boolean;
      role?: boolean;
      dateRange?: boolean;
    };
  };
}

export interface SetFilters {
  search: string;
  status: string;
  role: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  customFilterValues: Record<string, string>;
}
