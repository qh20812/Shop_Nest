import * as React from 'react';

import { cn } from '@/lib/utils';

import { Skeleton } from './skeleton';

function TableRoot({ className, ...props }: React.ComponentProps<'table'>) {
    return (
        <div className="w-full overflow-x-auto">
            <table className={cn('w-full border-collapse text-left', className)} {...props} />
        </div>
    );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
    return <thead className={cn('border-b border-border bg-raw-linen/50', className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
    return <tbody className={cn('divide-y divide-border', className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
    return <tr className={cn('transition-colors hover:bg-rice-paper/60', className)} {...props} />;
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
    return (
        <th
            className={cn(
                'px-4 py-3 font-sans text-label-micro font-medium uppercase tracking-[0.12em] text-ink-muted',
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
    return <td className={cn('px-4 py-3 text-body-sm text-ink', className)} {...props} />;
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
    return <caption className={cn('mt-3 text-body-sm text-ink-muted', className)} {...props} />;
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

type TableProps<T> = {
    columns: ColumnDef<T>[];
    data: T[];
    rowKey?: keyof T | ((row: T) => string | number);
    density?: 'compact' | 'comfortable';
    stickyHeader?: boolean;
    loading?: boolean;
    empty?: React.ReactNode;
    className?: string;
    onRowClick?: (row: T) => void;
};

const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
};

function getRowKey<T>(row: T, index: number, rowKey?: keyof T | ((row: T) => string | number)): string | number {
    if (typeof rowKey === 'function') {
        return rowKey(row);
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
}: TableProps<T>) {
    const cellPadding = density === 'compact' ? 'py-2' : 'py-3';

    return (
        <TableRoot className={className}>
            <TableHeader className={stickyHeader ? 'sticky top-0 z-10' : undefined}>
                <tr>
                    {columns.map((column) => (
                        <TableHead
                            key={column.key}
                            style={column.width ? { width: column.width } : undefined}
                            className={cn(alignClasses[column.align ?? 'left'], column.className)}
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
                                <TableCell key={column.key} className={cn(cellPadding, column.className)}>
                                    <Skeleton className="h-4" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="py-10 text-center text-ink-muted">
                            {empty ?? 'Chưa có dữ liệu.'}
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((row, index) => (
                        <TableRow
                            key={getRowKey(row, index, rowKey)}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                            className={onRowClick ? 'cursor-pointer' : undefined}
                        >
                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    className={cn(cellPadding, alignClasses[column.align ?? 'left'], column.className)}
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

export {
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRoot,
    TableRow,
    type ColumnDef,
    type TableProps,
};
export { Table as DataTable };
export default Table;
