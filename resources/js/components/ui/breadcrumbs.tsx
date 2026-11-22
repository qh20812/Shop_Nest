import { Link } from '@inertiajs/react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

type BreadcrumbItem = {
    label: React.ReactNode;
    href?: string;
    current?: boolean;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
    maxItems?: number;
    className?: string;
};

type VisibleCrumb = { type: 'item'; item: BreadcrumbItem } | { type: 'ellipsis' };

function isExternal(href: string): boolean {
    return /^https?:\/\//.test(href);
}

function toVisibleCrumbs(items: BreadcrumbItem[], maxItems?: number): VisibleCrumb[] {
    if (!maxItems || items.length <= maxItems) {
        return items.map((item) => ({ type: 'item', item }));
    }

    return [{ type: 'item', item: items[0] }, { type: 'ellipsis' }, ...items.slice(-(maxItems - 2)).map((item) => ({ type: 'item' as const, item }))];
}

export function Breadcrumbs({ items, maxItems, className }: BreadcrumbsProps) {
    if (items.length === 0) {
        return null;
    }

    const visibleItems = toVisibleCrumbs(items, maxItems);

    return (
        <nav aria-label="Breadcrumb" className={cx('sn-breadcrumbs', className)}>
            <ol className="sn-breadcrumbs__list">
                {visibleItems.map((crumb, index) => {
                    const isLast = index === visibleItems.length - 1;

                    return (
                        <li key={index} className="sn-breadcrumbs__item">
                            {index > 0 && <ChevronRight aria-hidden="true" className="sn-breadcrumbs__sep" />}
                            {crumb.type === 'ellipsis' ? (
                                <MoreHorizontal aria-hidden="true" className="sn-breadcrumbs__icon" />
                            ) : crumb.item.href && !isLast && !crumb.item.current ? (
                                isExternal(crumb.item.href) ? (
                                    <a href={crumb.item.href} className="sn-breadcrumbs__link" target="_blank" rel="noreferrer noopener">
                                        {crumb.item.label}
                                    </a>
                                ) : (
                                    <Link href={crumb.item.href} className="sn-breadcrumbs__link">
                                        {crumb.item.label}
                                    </Link>
                                )
                            ) : (
                                <span
                                    aria-current={isLast || crumb.item.current ? 'page' : undefined}
                                    data-current={isLast || crumb.item.current ? 'true' : undefined}
                                    className="sn-breadcrumbs__current"
                                >
                                    {crumb.item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export type { BreadcrumbItem, BreadcrumbsProps };
export default Breadcrumbs;
