import React from 'react';
import { useTranslation } from '@/lib/i18n';
import '@/../css/Page.css';

export type SortDirection = 'asc' | 'desc';

export interface AnalyticsTableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (value: unknown, row: T, rowIndex: number) => React.ReactNode;
}

export interface AnalyticsTableProps<T> {
  data: T[];
  columns: AnalyticsTableColumn<T>[];
  headerTitle?: string;
  headerIcon?: string;
  emptyMessage?: string;
  loading?: boolean;
  sortKey?: string;
  sortDirection?: SortDirection;
  onSortChange?: (key: string, direction: SortDirection) => void;
  rowKey?: (row: T, index: number) => string | number;
  footer?: React.ReactNode;
  className?: string;
}

function getAlignmentClass(align: 'left' | 'center' | 'right' | undefined): string {
  switch (align) {
    case 'center':
      return 'analytics-table__cell--center';
    case 'right':
      return 'analytics-table__cell--right';
    default:
      return '';
  }
}

function getSortIcon(direction: SortDirection | undefined): string {
  if (!direction) {
    return 'bx-sort';
  }

  return direction === 'asc' ? 'bx-sort-up' : 'bx-sort-down';
}

const AnalyticsTable = <T extends Record<string, unknown>>({
  data,
  columns,
  headerTitle,
  headerIcon = 'bx-table',
  emptyMessage,
  loading = false,
  sortKey,
  sortDirection,
  onSortChange,
  rowKey,
  footer,
  className = '',
}: AnalyticsTableProps<T>) => {
  const { t } = useTranslation();

  const handleSort = (column: AnalyticsTableColumn<T>) => {
    if (!onSortChange || !column.sortable) {
      return;
    }

    const columnKey = typeof column.key === 'string' ? column.key : String(column.key);
    const nextDirection: SortDirection = sortKey === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(columnKey, nextDirection);
  };

  const headerLabel = headerTitle ? t(headerTitle) : undefined;

  return (
    <div className={`bottom-data analytics-table ${className}`.trim()}>
      <div className="orders">
        {headerLabel ? (
          <div className="header">
            <i className={`bx ${headerIcon}`}></i>
            <h3>{headerLabel}</h3>
          </div>
        ) : null}

        <div className="analytics-table__wrapper">
          <table>
            <thead>
              <tr>
                {columns.map((column, columnIndex) => {
                  const columnKey = typeof column.key === 'string' ? column.key : String(column.key);
                  const isSorted = sortKey === columnKey;
                  const sortIcon = getSortIcon(isSorted ? sortDirection : undefined);

                  return (
                    <th
                      key={columnIndex}
                      style={{ width: column.width }}
                      className={column.sortable ? 'analytics-table__sortable' : ''}
                      onClick={() => handleSort(column)}
                    >
                      <span>{t(column.label)}</span>
                      {column.sortable ? <i className={`bx ${sortIcon}`}></i> : null}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="analytics-table__loading">
                    <i className="bx bx-loader-circle bx-spin"></i>
                    <span>{t('Loading data...')}</span>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="analytics-table__empty">
                    <i className="bx bx-info-circle"></i>
                    <span>{t(emptyMessage ?? 'No data found')}</span>
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => {
                  const key = rowKey ? rowKey(row, rowIndex) : rowIndex;

                  return (
                    <tr key={key}>
                      {columns.map((column, columnIndex) => {
                        const columnKey = typeof column.key === 'string' ? column.key : String(column.key);
                        const rawValue = (row as Record<string, unknown>)[columnKey];
                        const cellValue = column.render ? column.render(rawValue, row, rowIndex) : rawValue;
                        const alignmentClass = getAlignmentClass(column.align);

                        return (
                          <td key={`${columnKey}-${columnIndex}`} className={alignmentClass}>
                            {cellValue as React.ReactNode}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {footer ? <div className="analytics-table__footer">{footer}</div> : null}
      </div>
    </div>
  );
};

export default AnalyticsTable;
