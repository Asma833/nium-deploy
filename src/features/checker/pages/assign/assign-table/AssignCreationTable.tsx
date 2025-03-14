import { DynamicTable } from "@/components/common/dynamic-table/DynamicTable";
import { getAssignCreationColumns } from "./assign-creation-table-col";
import { transactionTableData as initialData } from "./assign-table-value";
import { useState, useEffect } from "react";
import { useFilterApi } from "@/components/common/dynamic-table/hooks/useFilterApi";
import { useDynamicPagination } from "@/components/common/dynamic-table/hooks/useDynamicPagination";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API } from "@/core/constant/apis";
import { usePageTitle } from "@/components/common/PageTitle";

const AssignCreationTable = () => {
  const { setTitle } = usePageTitle();
        useEffect(() => {
          setTitle("Assign");
        }, [setTitle]);
  const [tableData, setTableData] = useState(
    // Add isSelected property to all rows initialized as false
    initialData.map((item) => ({ ...item, isSelected: false }))
  );
  
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isTableFilterDynamic = false;
  const isPaginationDynamic = false;

  // Use the dynamic pagination hook
  const pagination = useDynamicPagination({
    endpoint: API.CHECKER.ASSIGN.SEARCH_FILTER,
    initialPageSize: 10,
    initialData,
    dataPath: "transactions",
    totalRecordsPath: "totalRecords",
  });

  // Using the filter API hook
  const filterApi = useFilterApi({
    endpoint: API.CHECKER.ASSIGN.SEARCH_FILTER,
    initialData,
    // base query params if needed
    baseQueryParams: {
      // For example: clientId: '123'
    },
  });

  const handleSelectionChange = (rowId: string, checked: boolean) => {
    // Update the table data to reflect the selection
    setTableData((prevData) =>
      prevData.map((row) =>
        row.niumId === rowId ? { ...row, isSelected: checked } : row
      )
    );

    // Update the selected rows array
    setSelectedRows((prev) => {
      if (checked) {
        return [...prev, rowId];
      } else {
        return prev.filter((id) => id !== rowId);
      }
    });
  };

  const handleTakeRequest = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one transaction");
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call - replace with actual API endpoint in production
      // const response = await axios.post(API.CHECKER.ASSIGN.TAKE_REQUEST, {
      //   transactionIds: selectedRows,
      // });

      // Handle successful response
      toast.success(
        `Successfully assigned ${selectedRows.length} transaction(s)`
      );

      // Clear selections after successful submission
      setTableData((prevData) =>
        prevData.map((row) => ({ ...row, isSelected: false }))
      );
      setSelectedRows([]);

      // Optionally, refetch the data to get the latest state
      // filterApi.refreshData();
    } catch (error) {
      console.error("Error taking request:", error);
      toast.error("Failed to take request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = getAssignCreationColumns(handleSelectionChange);

  // Load initial data when the component mounts
  useEffect(() => {
    if (isPaginationDynamic) {
      pagination.loadInitialData();
    }
  }, [isPaginationDynamic, pagination]);

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center">
        {(filterApi.loading || pagination.loading) && (
          <span className="text-blue-500">Loading data...</span>
        )}
        {(filterApi.error || pagination.error) && (
          <span className="text-red-500">Error loading data</span>
        )}
      </div>

      <DynamicTable
        columns={columns}
        data={
          isPaginationDynamic
            ? pagination.data
            : isTableFilterDynamic && filterApi.data.length > 0
            ? filterApi.data
            : tableData
        }
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
        loading={filterApi.loading || pagination.loading || isSubmitting}
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
          rederFilerOptions: {
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

      <div className="w-full  flex flex-col items-center justify-start gap-3">
        <div className="text-sm text-gray-500">
          {selectedRows.length} transaction
          {selectedRows.length !== 1 ? "s" : ""} selected
        </div>
        <Button
          onClick={handleTakeRequest}
          disabled={selectedRows.length === 0 || isSubmitting}
          className="border"
        >
          {isSubmitting
            ? "Processing..."
            : `Take Request${selectedRows.length !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  );
};

export default AssignCreationTable;
