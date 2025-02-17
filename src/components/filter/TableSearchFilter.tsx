import { SearchInput } from "./SearchInput";
import { TableSearchFilterProps } from "./filter.types";



const TableSearchFilter = ({
  filters,
  filterConfig,
  setFilters,
}: TableSearchFilterProps) => {
  const { search } = filterConfig.rederFilerOptions;
  return (
    <div className="flex items-center justify-end gap-4 flex-wrap text-[--primary-text]">
      {search && (
        <SearchInput
          value={filters.search}
          onChange={(value) => setFilters({ ...filters, search: value })}
        />
      )}
    </div>
  );
};

export default TableSearchFilter;
