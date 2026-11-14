import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex w-fit items-center gap-1.5 rounded-chip border font-sans font-medium whitespace-nowrap',
    {
        variants: {
            tone: {
                neutral: 'border-border bg-raw-linen text-ink-muted',
                accent: 'border-lacquer-wash bg-lacquer-wash text-lacquer-deep',
                success: 'border-jade/20 bg-jade-soft text-jade',
                warning: 'border-turmeric/20 bg-turmeric-soft text-turmeric',
                danger: 'border-brick/20 bg-brick-soft text-brick',
                outline: 'border-border bg-transparent text-ink-muted',
                ink: 'border-ink bg-ink text-warm-porcelain',
            },
            size: {
                sm: 'px-2 py-0.5 text-label-micro',
                md: 'px-2.5 py-1 text-body-sm',
            },
        },
        defaultVariants: {
            tone: 'neutral',
            size: 'sm',
        },
    },
);

type BadgeProps = React.ComponentProps<'span'> &
    VariantProps<typeof badgeVariants> & {
        icon?: LucideIcon;
        dot?: boolean;
    };

function Badge({ className, tone, size, icon: Icon, dot = false, children, ...props }: BadgeProps) {
    return (
        <span data-slot="badge" className={cn(badgeVariants({ tone, size }), className)} {...props}>
            {dot && <span aria-hidden="true" className="size-1.5 rounded-pill bg-current" />}
            {Icon && <Icon aria-hidden="true" className="size-3.5" />}
            {children}
        </span>
    );
}

export { Badge, badgeVariants };
export type { BadgeProps };
export default Badge;
