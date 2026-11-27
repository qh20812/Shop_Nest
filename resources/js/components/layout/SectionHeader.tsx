import * as React from 'react';

import { Eyebrow, Heading, Text } from '@/components/ui/typography';
import { cx } from '@/lib/cx';

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
        <div className={cx('sn-section-header', className)} data-align={align}>
            <div className="sn-section-header__text">
                {eyebrow && <Eyebrow tone="accent">{eyebrow}</Eyebrow>}
                <Heading level={2} size="headline-2">
                    {title}
                </Heading>
                {description && (
                    <Text size="body-sm" tone="muted" className="sn-section-header__desc">
                        {description}
                    </Text>
                )}
            </div>
            {action && <div className="sn-section-header__action">{action}</div>}
        </div>
    );
}

export default SectionHeader;
