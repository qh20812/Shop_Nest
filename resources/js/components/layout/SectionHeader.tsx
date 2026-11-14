import * as React from 'react';

import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type SectionHeaderProps = {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    align?: 'left' | 'center';
    className?: string;
};

export function SectionHeader({ eyebrow, title, description, action, align = 'left', className }: SectionHeaderProps) {
    return (
        <div
            className={cn(
                'mb-6 flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-end md:justify-between',
                align === 'center' && 'items-center text-center md:flex-col md:text-center',
                className,
            )}
        >
            <div className={cn('flex flex-col gap-1.5', align === 'center' && 'items-center')}>
                {eyebrow && <Eyebrow tone="accent">{eyebrow}</Eyebrow>}
                <Heading level={2} size="headline-2">
                    {title}
                </Heading>
                {description && (
                    <Text size="body-sm" tone="muted" className="max-w-prose">
                        {description}
                    </Text>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

export default SectionHeader;
