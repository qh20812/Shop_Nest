import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
    breadcrumbs?: BreadcrumbItem[];
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    count?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
};

export function PageHeader({ breadcrumbs, eyebrow, title, description, count, actions, className }: PageHeaderProps) {
    return (
        <header className={cn('flex flex-col gap-4', className)}>
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
            <div className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-1.5">
                    {eyebrow && <Eyebrow tone="accent">{eyebrow}</Eyebrow>}
                    <div className="flex flex-wrap items-center gap-3">
                        <Heading level={1} size="headline-1">
                            {title}
                        </Heading>
                        {count !== undefined && count !== null && (
                            <Badge tone="neutral" size="md">
                                {count}
                            </Badge>
                        )}
                    </div>
                    {description && (
                        <Text size="body-md" tone="muted" className="max-w-prose">
                            {description}
                        </Text>
                    )}
                </div>
                {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
        </header>
    );
}

export default PageHeader;
