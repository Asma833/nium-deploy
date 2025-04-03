export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
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
  applyAction: boolean,
  resetAction: boolean,
}

export type FilterMode = "static" | "dynamic";

export interface DynamicFilterCallbacks<T = any> {
  onSearch?: (term: string) => Promise<T[]>;
  onDateRangeChange?: (from: Date | undefined, to: Date | undefined) => Promise<T[]>;
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

export interface SetFilters {
  search: string;
  status: string;
  role: string;
  dateRange: DateRange;
  customFilterValues: Record<string, string>;
}

export interface TableSearchFilterProps {
  filters: SetFilters;
  filterConfig: FilterConfig;
  setFilters: (filters: SetFilters) => void;
  onFilter?: () => void;
  onReset?: () => void;
  setLoading?: (loading: boolean) => void;
  setDynamicData?: (data: any[]) => void;
}
