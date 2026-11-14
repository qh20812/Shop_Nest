import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-card', {
    variants: {
        variant: {
            flat: 'border border-border bg-warm-porcelain',
            raised: 'border border-border bg-warm-porcelain shadow-soft',
            inset: 'border border-border bg-rice-paper',
            ghost: 'bg-transparent',
        },
        padding: {
            none: 'p-0',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
        },
    },
    defaultVariants: {
        variant: 'flat',
        padding: 'md',
    },
});

type CardProps = React.ComponentProps<'div'> & VariantProps<typeof cardVariants>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, padding, ...props }, ref) => (
    <div ref={ref} data-slot="card" className={cn(cardVariants({ variant, padding }), className)} {...props} />
));

Card.displayName = 'Card';

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('flex flex-col gap-1', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
    return <h3 className={cn('text-headline-3 text-ink', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
    return <p className={cn('text-body-sm text-ink-muted', className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('text-body-md text-ink', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cn('flex items-center gap-3 border-t border-border pt-4', className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
export type { CardProps };
