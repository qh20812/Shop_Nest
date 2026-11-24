import { ArrowDown, ArrowUp, ArrowUpDown, Info, Table2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { Table, type ColumnDef } from '@/components/ui/table';
import { useTranslation } from '@/lib/i18n';

import styles from './analytics.module.css';

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
    headerIcon?: React.ReactNode;
    emptyMessage?: string;
    loading?: boolean;
    sortKey?: string;
    sortDirection?: SortDirection;
    onSortChange?: (key: string, direction: SortDirection) => void;
    rowKey?: (row: T, index: number) => string | number;
    footer?: React.ReactNode;
    className?: string;
}

function compareValues(a: unknown, b: unknown): number {
    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }

    return String(a ?? '').localeCompare(String(b ?? ''), 'vi');
}

const AnalyticsTable = <T extends Record<string, unknown>>({
    data,
    columns,
    headerTitle,
    headerIcon,
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
    const [internalSort, setInternalSort] = useState<{ key: string; direction: SortDirection } | null>(null);

    const activeSortKey = sortKey ?? internalSort?.key;
    const activeDirection = sortDirection ?? internalSort?.direction;

    const sortedData = useMemo(() => {
        if (!activeSortKey || !activeDirection) {
            return data;
        }

        return [...data].sort((first, second) => {
            const result = compareValues(first[activeSortKey], second[activeSortKey]);
            return activeDirection === 'asc' ? result : -result;
        });
    }, [activeDirection, activeSortKey, data]);

    const handleSort = (column: AnalyticsTableColumn<T>) => {
        if (!column.sortable) {
            return;
        }

        const columnKey = String(column.key);
        const nextDirection: SortDirection = activeSortKey === columnKey && activeDirection === 'asc' ? 'desc' : 'asc';

        setInternalSort({ key: columnKey, direction: nextDirection });
        onSortChange?.(columnKey, nextDirection);
    };

    const sortIcon = (column: AnalyticsTableColumn<T>, columnKey: string) => {
        if (!column.sortable) {
            return null;
        }

        if (activeSortKey !== columnKey) {
            return <ArrowUpDown aria-hidden="true" className={styles.sortIcon} />;
        }

        return activeDirection === 'asc' ? (
            <ArrowUp aria-hidden="true" className={styles.sortIcon} />
        ) : (
            <ArrowDown aria-hidden="true" className={styles.sortIcon} />
        );
    };

    const tableColumns: ColumnDef<T>[] = columns.map((column, index) => {
        const columnKey = String(column.key);

        return {
            key: columnKey || `column-${index}`,
            align: column.align,
            width: column.width,
            header: column.sortable ? (
                <button type="button" className={styles.sortButton} onClick={() => handleSort(column)}>
                    <span>{t(column.label)}</span>
                    {sortIcon(column, columnKey)}
                </button>
            ) : (
                t(column.label)
            ),
            cell: (row: T) => {
                const rawValue = row[columnKey];
                return column.render ? column.render(rawValue, row, index) : (rawValue as React.ReactNode);
            },
        };
    });

    return (
        <section className={`${styles.tableCard} ${className}`.trim()}>
            {headerTitle ? (
                <div className={styles.tableHead}>
                    <h3 className={styles.tableTitle}>
                        {headerIcon ? (
                            <span className={styles.tableTitleIcon}>{headerIcon}</span>
                        ) : (
                            <Table2 aria-hidden="true" className={styles.tableTitleIcon} />
                        )}
                        {t(headerTitle)}
                    </h3>
                </div>
            ) : null}

            <Table
                columns={tableColumns}
                data={sortedData}
                rowKey={rowKey ? (row, index) => rowKey(row, index) : undefined}
                loading={loading}
                empty={
                    <span className={styles.emptyCell}>
                        <Info aria-hidden="true" className={styles.emptyIcon} />
                        {t(emptyMessage ?? 'No data found')}
                    </span>
                }
            />

            {footer ? <div className={styles.tableFooter}>{footer}</div> : null}
        </section>
    );
};

export default AnalyticsTable;
