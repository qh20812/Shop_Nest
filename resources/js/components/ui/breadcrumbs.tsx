import { Link } from '@inertiajs/react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

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

function isExternal(href: string): boolean {
    return /^https?:\/\//.test(href);
}

export function Breadcrumbs({ items, maxItems, className }: BreadcrumbsProps) {
    if (items.length === 0) {
        return null;
    }

    let visibleItems = items;

    if (maxItems && items.length > maxItems) {
        const head = items.slice(0, 1);
        const tail = items.slice(-(maxItems - 2));
        visibleItems = [...head, { label: <MoreHorizontal aria-hidden="true" className="size-4" /> }, ...tail];
    }

    return (
        <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
            <ol className="flex flex-wrap items-center gap-1.5 text-body-sm text-ink-muted">
                {visibleItems.map((item, index) => {
                    const isLast = index === visibleItems.length - 1 || item.current;

                    return (
                        <li key={index} className="inline-flex min-w-0 items-center gap-1.5">
                            {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-ink-faint" />}
                            {item.href && !isLast ? (
                                isExternal(item.href) ? (
                                    <a
                                        href={item.href}
                                        className="truncate transition-colors hover:text-ink focus-ring"
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <Link href={item.href} className="truncate transition-colors hover:text-ink focus-ring">
                                        {item.label}
                                    </Link>
                                )
                            ) : (
                                <span aria-current={isLast ? 'page' : undefined} className={cn('truncate', isLast && 'font-medium text-ink')}>
                                    {item.label}
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
