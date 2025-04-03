import { DynamicTable } from "@/components/common/dynamic-table/DynamicTable";
import { getRateMarginCreationColumns } from "./rate-margin-table-col";
import { rateMarginTableData } from "./rate-margin-table-value";
import { useDynamicPagination } from "@/components/common/dynamic-table/hooks/useDynamicPagination";
import { API } from "@/core/constant/apis";
import { useFilterApi } from "@/components/common/dynamic-table/hooks/useFilterApi";

const RateMarginTable = () => {
const isTableFilterDynamic = false;
const isPaginationDynamic = false;
    const columns = getRateMarginCreationColumns();

    // Use the dynamic pagination hook
      const pagination = useDynamicPagination({
        endpoint: API.CHECKER.ASSIGN.LIST,
        initialPageSize: 10,
        dataPath: "transactions",
        totalRecordsPath: "totalRecords",
      });
    
      // Using the filter API hook
      const filterApi = useFilterApi({
        endpoint: API.CHECKER.ASSIGN.LIST,
        baseQueryParams: {},
      });
    return (
        <div className="flex flex-col">
          {/* <div className="mb-4 flex items-center">
            {(filterApi.loading || pagination.loading || loading) && (
              <span className="text-blue-500">Loading data...</span>
            )}
            {(filterApi.error || pagination.error || error) && (
              <span className="text-red-500">Error loading data</span>
            )}
          </div> */}
    
          <DynamicTable
            columns={columns}
            data={rateMarginTableData}
            defaultSortColumn="nium_order_id"
            defaultSortDirection="asc"
            loading={
              filterApi.loading || pagination.loading 
            }
            paginationMode={isPaginationDynamic ? "dynamic" : "static"}
            onPageChange={
              isPaginationDynamic
                ? pagination.handlePageChange
                : async (_page: number, _pageSize: number) => []
            }
            totalRecords={pagination.totalRecords}
            filter={{
              filterOption: true,
              mode: isTableFilterDynamic ? "dynamic" : "static",
              renderFilterOptions: {
                search: true,
              },
              // Dynamic callbacks - API functions
              dynamicCallbacks: isTableFilterDynamic
                ? {
                    onSearch: filterApi.search,
                  }
                : undefined,
            }}
          />
    
        
        </div>
      );
};
export default RateMarginTable;