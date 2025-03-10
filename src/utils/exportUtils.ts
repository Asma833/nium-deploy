// Note: Run `npm install --save-dev @types/file-saver` to fix TypeScript errors
import { toast } from "sonner";
// Import xlsx and file-saver properly at the top level
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Exports data to CSV file
 * @param data Array of data to export
 * @param columns Table columns configuration with accessorKey and header properties
 * @param filename Name for the exported file (without extension)
 */
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  columns: { accessorKey?: string; header?: string }[],
  filename: string = "exported-data"
) => {
  try {
    if (!data || data.length === 0) {
      toast.error("No data available to export");
      return;
    }

    console.log("Data to export:", data); // Debug log

    // Create a simple array of objects containing only the necessary properties
    const flattenedData = data.map((row) => {
      const rowData: Record<string, any> = {};

      // For each relevant column, extract the value
      columns
        .filter((col) => col.accessorKey)
        .forEach((col) => {
          const key = col.accessorKey as string;
          const header = col.header as string;
          // Safely access potentially nested properties
          const value = key.includes(".")
            ? key.split(".").reduce((obj, path) => obj?.[path], row)
            : row[key as keyof typeof row];
          rowData[header] = value !== undefined ? value : "";
        });

      return rowData;
    });

    console.log("Flattened data:", flattenedData); // Debug log

    // Create CSV headers and content
    const headers = Object.keys(flattenedData[0]);
    let csvContent = headers.join(",") + "\n";

    // Add rows
    flattenedData.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header]?.toString() || "";
        return value.includes(",") ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvContent += values.join(",") + "\n";
    });

    // For debug purposes, show the CSV content in console
    console.log("CSV Content preview:", csvContent.substring(0, 500));

    // Create file and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully");
  } catch (error) {
    console.error("Error exporting CSV:", error);
    toast.error("Failed to export CSV. Please try again.");
  }
};

/**
 * Exports data to Excel file
 * Requires xlsx and file-saver libraries to be installed:
 * npm install --save xlsx file-saver
 *
 * @param data Array of data to export
 * @param columns Table columns configuration with accessorKey and header properties
 * @param filename Name for the exported file (without extension)
 * @param sheetName Name of the Excel sheet
 */
export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  columns: { accessorKey?: string; header?: string }[],
  filename: string = "exported-data",
  sheetName: string = "Data"
) => {
  try {
    // No need to use require() anymore since we import at the top
    if (!data || data.length === 0) {
      toast.error("No data available to export");
      return;
    }

    // Extract only relevant data from columns with accessorKey
    const exportData = data.map((row) => {
      const exportRow: Record<string, any> = {};

      columns
        .filter((col) => col.accessorKey)
        .forEach((col) => {
          const key = col.accessorKey as string;
          const header = col.header as string;
          exportRow[header] = key.includes(".")
            ? key.split(".").reduce((obj, path) => obj?.[path], row)
            : row[key as keyof typeof row];
        });

      return exportRow;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create blob and save file
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      fileData,
      `${filename}-${new Date().toISOString().split("T")[0]}.xlsx`
    );

    toast.success("Excel file exported successfully");
  } catch (error) {
    console.error("Error exporting Excel file:", error);
    toast.error("Failed to export Excel file. Please try again.");
  }
};
