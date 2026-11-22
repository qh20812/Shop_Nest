import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';
import { formatNumber } from '@/lib/format';

type LegacyLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginationProps = {
    page?: number;
    pageCount?: number;
    total?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    links?: LegacyLink[];
    filters?: Record<string, string | number | boolean | undefined>;
    preserveState?: boolean;
    preserveScroll?: boolean;
    siblingCount?: number;
    className?: string;
};

type PageItem = number | 'ellipsis';

function getPageItems(page: number, pageCount: number, siblingCount: number): PageItem[] {
    if (pageCount <= 1) {
        return [1];
    }

    const start = Math.max(2, page - siblingCount);
    const end = Math.min(pageCount - 1, page + siblingCount);
    const items: PageItem[] = [1];

    if (start > 2) {
        items.push('ellipsis');
    }

    for (let index = start; index <= end; index += 1) {
        items.push(index);
    }

    if (end < pageCount - 1) {
        items.push('ellipsis');
    }

    items.push(pageCount);

    return items;
}

function cleanLabel(label: string): string {
    return label
        .replace(/&[a-z]+;/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
}

function isPreviousLabel(label: string): boolean {
    return /previous|trước/i.test(cleanLabel(label));
}

function isNextLabel(label: string): boolean {
    return /next|sau/i.test(cleanLabel(label));
}

function PaginationButton({
    children,
    active = false,
    disabled = false,
    label,
    onClick,
}: {
    children: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            data-active={active ? 'true' : undefined}
            disabled={disabled}
            onClick={onClick}
            className="sn-pagination__page"
        >
            {children}
        </button>
    );
}

export default function Pagination({
    page,
    pageCount,
    total,
    pageSize,
    onPageChange,
    links,
    filters = {},
    preserveState = true,
    preserveScroll = true,
    siblingCount = 1,
    className,
}: PaginationProps) {
    const isLegacy = Array.isArray(links);

    const handleLegacyChange = (url: string | null) => {
        if (!url) {
            return;
        }

        const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''));

        router.get(url, cleanFilters, { preserveState, preserveScroll });
    };

    if (isLegacy) {
        if (!links || links.length <= 3) {
            return null;
        }

        return (
            <nav aria-label="Phân trang" className={cx('sn-pagination', 'sn-pagination--centered', className)}>
                {links.map((link, index) => {
                    const label = cleanLabel(link.label);
                    const previous = isPreviousLabel(link.label);
                    const next = isNextLabel(link.label);
                    const isEllipsis = /hellip|…|\.\.\./i.test(link.label);

                    if (isEllipsis) {
                        return (
                            <span key={`ellipsis-${index}`} className="sn-pagination__gap">
                                <MoreHorizontal aria-hidden="true" />
                            </span>
                        );
                    }

                    return (
                        <PaginationButton
                            key={`${label}-${index}`}
                            active={link.active}
                            disabled={!link.url}
                            label={previous ? 'Trang trước' : next ? 'Trang sau' : `Trang ${label}`}
                            onClick={() => handleLegacyChange(link.url)}
                        >
                            {previous ? <ChevronLeft aria-hidden="true" /> : next ? <ChevronRight aria-hidden="true" /> : label}
                        </PaginationButton>
                    );
                })}
            </nav>
        );
    }

    if (!page || !pageCount || pageCount <= 1) {
        return null;
    }

    const items = getPageItems(page, pageCount, siblingCount);
    const from = pageSize ? (page - 1) * pageSize + 1 : null;
    const to = pageSize ? Math.min(page * pageSize, total ?? page * pageSize) : null;

    return (
        <div className={cx('sn-pagination--split', className)}>
            {total && from && to ? (
                <span className="sn-pagination__meta">
                    Hiển thị {formatNumber(from)} - {formatNumber(to)} trong {formatNumber(total)} sản phẩm
                </span>
            ) : (
                <span />
            )}
            <nav aria-label="Phân trang" className="sn-pagination">
                <PaginationButton label="Trang trước" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
                    <ChevronLeft aria-hidden="true" />
                </PaginationButton>

                {items.map((item, index) =>
                    item === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="sn-pagination__gap">
                            <MoreHorizontal aria-hidden="true" />
                        </span>
                    ) : (
                        <PaginationButton key={item} active={item === page} label={`Trang ${item}`} onClick={() => onPageChange?.(item)}>
                            {item}
                        </PaginationButton>
                    ),
                )}

                <PaginationButton label="Trang sau" disabled={page >= pageCount} onClick={() => onPageChange?.(page + 1)}>
                    <ChevronRight aria-hidden="true" />
                </PaginationButton>
            </nav>
        </div>
    );
}

export { Pagination };
export type { LegacyLink, PaginationProps };
