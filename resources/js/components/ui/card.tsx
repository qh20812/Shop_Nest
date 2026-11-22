import * as React from 'react';

import { cx } from '@/lib/cx';

type CardVariant = 'flat' | 'raised' | 'inset' | 'ghost';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

type CardVariantProps = { variant?: CardVariant; padding?: CardPadding };

/**
 * Compatibility helper for code that imported `cardVariants`.
 * Styling is driven by `data-variant` / `data-padding`, not class names.
 */
const cardVariants: (props?: CardVariantProps) => string = () => 'sn-card';

type CardProps = React.ComponentProps<'div'> & {
    variant?: CardVariant;
    padding?: CardPadding;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant = 'flat', padding = 'md', ...props }, ref) => (
    <div ref={ref} data-slot="card" data-variant={variant} data-padding={padding} className={cx('sn-card', className)} {...props} />
));

Card.displayName = 'Card';

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cx('sn-card__header', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
    return <h3 className={cx('sn-card__title', className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
    return <p className={cx('sn-card__description', className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cx('sn-card__content', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return <div className={cx('sn-card__footer', className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
export type { CardPadding, CardProps, CardVariant };
