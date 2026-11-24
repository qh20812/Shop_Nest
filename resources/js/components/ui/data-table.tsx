import { Info } from 'lucide-react';
import * as React from 'react';

import { renderIcon, type IconProp } from '@/lib/icon';
import { useTranslation } from '@/lib/i18n';

import { Table, type ColumnDef as TableColumnDef } from './table';

import styles from './data-table.module.css';

export interface DataTableColumn<T> {
    header: React.ReactNode;
    accessorKey?: keyof T;
    cell?: (row: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    /** Stable React key; falls back to the column index. */
    key?: string;
    width?: string;
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    headerTitle: string;
    headerIcon?: IconProp;
    emptyMessage?: string;
    className?: string;
}

function renderAccessor<T>(row: T, accessorKey: keyof T): React.ReactNode {
    const value = row[accessorKey];

    if (typeof value === 'object' && value !== null) {
        return '[Object]';
    }

    return String(value ?? '');
}

function headerIconNode(icon: IconProp) {
    return renderIcon(icon);
}

export default function DataTable<T>({ columns, data, headerTitle, headerIcon, emptyMessage = 'No data found', className }: DataTableProps<T>) {
    const { t } = useTranslation();

    const tableColumns: TableColumnDef<T>[] = columns.map((column, index) => ({
        key: column.key ?? `column-${index}`,
        header: column.header,
        align: column.align,
        width: column.width,
        cell: column.cell ?? (column.accessorKey ? (row: T) => renderAccessor(row, column.accessorKey as keyof T) : undefined),
    }));

    return (
        <section className={className ? `${styles.panel} ${className}` : styles.panel}>
            <div className={styles.head}>
                {headerIcon && <span className={styles.headIcon}>{headerIconNode(headerIcon)}</span>}
                <h2 className={styles.title}>{t(headerTitle)}</h2>
            </div>

            <Table
                columns={tableColumns}
                data={data}
                empty={
                    <span className={styles.empty}>
                        <Info aria-hidden="true" className={styles.emptyIcon} />
                        {t(emptyMessage)}
                    </span>
                }
            />
        </section>
    );
}

export { DataTable };
