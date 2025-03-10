import { DynamicTable } from "@/components/common/DynamicTable";
import { getTransactionTableColumns } from "./assign-creation-table-col";
import { transactionTableData as initialData } from "./assign-table-value";
import { useState } from "react";
import { useFilterApi } from "@/hooks/useFilterApi";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { API } from "@/core/constant/apis";

const AssignCreationTable = () => {
  const [tableData, setTableData] = useState(
    // Add isSelected property to all rows initialized as false
    initialData.map((item) => ({ ...item, isSelected: false }))
  );
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isTableFilterDynamic = false;

  // Using the hook with mock functionality for demo
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
      const response = await axios.post(API.CHECKER.ASSIGN.TAKE_REQUEST, {
        transactionIds: selectedRows,
      });

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

  const columns = getTransactionTableColumns(handleSelectionChange);

  // Define transaction type options
  const transactionTypeOptions = [
    { label: "All Types", value: "all" },
    { label: "Transfer", value: "transfer" },
    { label: "Payment", value: "payment" },
    { label: "Deposit", value: "deposit" },
    { label: "Withdrawal", value: "withdrawal" },
  ];

  // Define status options
  const transactionStatusOptions = [
    { label: "All Status", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Failed", value: "failed" },
    { label: "Processing", value: "processing" },
  ];

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center">
        {filterApi.loading && (
          <span className="text-blue-500">Loading data...</span>
        )}
        {filterApi.error && (
          <span className="text-red-500">
            Error loading data: {filterApi.error.message}
          </span>
        )}
      </div>

      <DynamicTable
        columns={columns}
        // If we have filterApi data and are in dynamic mode, use it
        data={
          isTableFilterDynamic && filterApi.data.length > 0
            ? filterApi.data
            : tableData
        }
        tableWrapperClass="bg-background p-5 rounded-md"
        defaultSortColumn="niumId"
        defaultSortDirection="asc"
        loading={filterApi.loading}
        filter={{
          filterOption: true,
          mode: isTableFilterDynamic ? "dynamic" : "static",
          dateFilterColumn: "orderDate",
          statusFilerColumn: "status",
          roleFilerColumn: "role",
          rederFilerOptions: {
            search: true,
            dateRange: true,
            status: {
              label: "Status",
              placeholder: "Select status",
              options: transactionStatusOptions,
            },
            selects: [
              {
                id: "transactionType",
                label: "Type",
                placeholder: "Select type",
                options: transactionTypeOptions,
              },
            ],
          },
          // Dynamic callbacks - use real API functions or mock implementations
          dynamicCallbacks: isTableFilterDynamic
            ? {
                onSearch: filterApi.search,
                onDateRangeChange: filterApi.filterByDateRange,
                onStatusChange: filterApi.filterByStatus,
                onSelectChange: filterApi.filterBySelect,
                onFilterApply: filterApi.applyFilters,
              }
            : undefined,
        }}
      />

      <div className="mt-4 flex flex-col items-center justify-start gap-3">
        <div className="text-sm text-gray-500">
          {selectedRows.length} transaction
          {selectedRows.length !== 1 ? "s" : ""} selected
        </div>
        <Button
          onClick={handleTakeRequest}
          disabled={selectedRows.length === 0 || isSubmitting}
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
