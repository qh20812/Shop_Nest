import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';

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
        <header className={cx('sn-page-header', className)}>
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} as="div" />}
            <div className="sn-page-header__bar">
                <div className="sn-page-header__heading">
                    {eyebrow && <Eyebrow tone="accent">{eyebrow}</Eyebrow>}
                    <div className="sn-page-header__title-row">
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
                        <Text size="body-md" tone="muted" className="sn-page-header__desc">
                            {description}
                        </Text>
                    )}
                </div>
                {actions && <div className="sn-page-header__actions">{actions}</div>}
            </div>
        </header>
    );
}

export default PageHeader;
