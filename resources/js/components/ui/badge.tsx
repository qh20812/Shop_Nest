import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'outline' | 'ink';
type BadgeSize = 'sm' | 'md';

type BadgeVariantProps = { tone?: BadgeTone; size?: BadgeSize };

/**
 * Compatibility helper for code that imported `badgeVariants`.
 * Styling is driven by `data-tone` / `data-size`, not class names.
 */
const badgeVariants: (props?: BadgeVariantProps) => string = () => 'sn-badge';

type BadgeProps = React.ComponentProps<'span'> & {
    tone?: BadgeTone;
    size?: BadgeSize;
    icon?: LucideIcon;
    dot?: boolean;
};

function Badge({ className, tone = 'neutral', size = 'sm', icon: Icon, dot = false, children, ...props }: BadgeProps) {
    return (
        <span data-slot="badge" data-tone={tone} data-size={size} className={cx('sn-badge', className)} {...props}>
            {dot && <span aria-hidden="true" className="sn-badge__dot" />}
            {Icon && <Icon aria-hidden="true" className="sn-badge__icon" />}
            {children}
        </span>
    );
}

export { Badge, badgeVariants };
export type { BadgeProps, BadgeSize, BadgeTone };
export default Badge;
