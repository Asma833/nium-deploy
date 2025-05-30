export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

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
  filterConfig: FilterConfig;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onFilter?: () => void;
  onReset?: () => void;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setDynamicData?: React.Dispatch<React.SetStateAction<any[]>>;
  // Removed isPaginationAction property
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectConfig {
  id: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
}

export interface StatusConfig {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
}

export interface RenderFilterOptions {
  search: boolean;
  dateRange?: boolean;
  status?: StatusConfig;
  selects?: SelectConfig[];
  applyAction: boolean;
  resetAction: boolean;
}

export type FilterMode = 'static' | 'dynamic';

export interface DynamicFilterCallbacks<T = any> {
  onSearch?: (term: string) => Promise<T[]>;
  onDateRangeChange?: (
    from: Date | undefined,
    to: Date | undefined
  ) => Promise<T[]>;
  onStatusChange?: (status: string) => Promise<T[]>;
  onSelectChange?: (id: string, value: string) => Promise<T[]>;
  onFilterApply?: (filters: SetFilters) => Promise<T[]>;
}

export interface FilterConfig {
  filterOption: boolean;
  mode?: FilterMode;
  renderFilterOptions: RenderFilterOptions;
  dynamicCallbacks?: DynamicFilterCallbacks;
}

import React from 'react';

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
  filterConfig: FilterConfig;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onFilter?: () => void;
  onReset?: () => void;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setDynamicData?: React.Dispatch<React.SetStateAction<any[]>>;
  // Removed isPaginationAction property as it's not needed
}
