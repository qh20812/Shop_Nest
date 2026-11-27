import * as React from 'react';

import { cx } from '@/lib/cx';

import { Skeleton } from './skeleton';

function TableRoot({ className, ...props }: React.ComponentProps<'table'>) {
    return (
        <div className="sn-table-wrap">
            <table className={cx('sn-table', className)} {...props} />
        </div>
    );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
    return <thead className={cx('sn-table__head', className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
    return <tbody className={cx('sn-table__body', className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
    return <tr className={cx('sn-table__row', className)} {...props} />;
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
    return <th className={cx('sn-table__th', className)} {...props} />;
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
    return <td className={cx('sn-table__td', className)} {...props} />;
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
    return <caption className={cx('sn-table__caption', className)} {...props} />;
}

type ColumnDef<T> = {
    key: string;
    header: React.ReactNode;
    cell?: (row: T) => React.ReactNode;
    accessor?: (row: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
    width?: string;
};

const DEFAULT_ALIGN = 'left' as const;

type TableProps<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    rowKey?: keyof T | ((row: T, index: number) => string | number);
    density?: 'compact' | 'comfortable';
    stickyHeader?: boolean;
    loading?: boolean;
    empty?: React.ReactNode;
    className?: string;
    onRowClick?: (row: T) => void;
    rowClassName?: (row: T) => string | undefined;
};

function getRowKey<T>(row: T, index: number, rowKey?: keyof T | ((row: T, index: number) => string | number)): string | number {
    if (typeof rowKey === 'function') {
        return rowKey(row, index);
    }

    if (rowKey) {
        const value = row[rowKey];

        if (typeof value === 'string' || typeof value === 'number') {
            return value;
        }
    }

    return index;
}

export function Table<T>({
    columns,
    data,
    rowKey,
    density = 'comfortable',
    stickyHeader = false,
    loading = false,
    empty,
    className,
    onRowClick,
    rowClassName,
}: TableProps<T>) {
    return (
        <TableRoot className={className}>
            <TableHeader data-sticky={stickyHeader ? 'true' : undefined}>
                <tr>
                    {columns.map((column) => (
                        <TableHead
                            key={column.key}
                            style={column.width ? { width: column.width } : undefined}
                            data-align={column.align ?? DEFAULT_ALIGN}
                            className={column.className}
                            scope="col"
                        >
                            {column.header}
                        </TableHead>
                    ))}
                </tr>
            </TableHeader>
            <TableBody>
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                            {columns.map((column) => (
                                <TableCell key={column.key} data-density={density} className={column.className}>
                                    <Skeleton />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={columns.length} data-empty="true">
                            {empty ?? 'Chưa có dữ liệu.'}
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((row, index) => (
                        <TableRow
                            key={getRowKey(row, index, rowKey)}
                            data-clickable={onRowClick ? 'true' : undefined}
                            className={rowClassName?.(row)}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    data-density={density}
                                    data-align={column.align ?? DEFAULT_ALIGN}
                                    className={column.className}
                                >
                                    {column.cell ? column.cell(row) : column.accessor ? column.accessor(row) : null}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                )}
            </TableBody>
        </TableRoot>
    );
}

export { Table as DataTable, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRoot, TableRow, type ColumnDef, type TableProps };
export default Table;
