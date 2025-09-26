import React from "react";
import { useTranslation } from "@/lib/i18n";

// T is a generic type for the data in each row, e.g., User or Category
interface ColumnDef<T> {
  header: string; // The text for the <th>
  accessorKey?: keyof T; // The key to access data from the row object
  cell?: (row: T) => React.ReactNode; // Custom render function for the cell
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  headerTitle: string;
  headerIcon: string;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  headerTitle,
  headerIcon,
  emptyMessage = "No data found"
}: DataTableProps<T>) {
  const { t } = useTranslation();

  return (
    <div className="bottom-data">
      <div className="orders">
        <div className="header">
          <i className={`bx ${headerIcon}`}></i>
          <h3>{t(headerTitle)}</h3>
        </div>
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{t(column.header)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.cell 
                        ? column.cell(row) 
                        : column.accessorKey 
                        ? String(row[column.accessorKey])
                        : ''
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center", padding: "24px", color: "var(--dark-grey)" }}>
                  <i className="bx bx-info-circle" style={{ fontSize: "48px", display: "block", marginBottom: "8px" }}></i>
                  {t(emptyMessage)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
