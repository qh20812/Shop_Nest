import * as React from 'react';

import { cx } from '@/lib/cx';

type SkeletonVariant = 'text' | 'title' | 'rect' | 'circle' | 'button';

/**
 * Compatibility helper for code that imported `skeletonVariants`.
 * Shape is driven by `data-variant`, not class names.
 */
const skeletonVariants: (props?: { variant?: SkeletonVariant }) => string = () => 'sn-skeleton';

type SkeletonProps = React.ComponentProps<'div'> & {
    variant?: SkeletonVariant;
};

export function Skeleton({ className, variant = 'text', ...props }: SkeletonProps) {
    return <div aria-hidden="true" data-variant={variant} className={cx('sn-skeleton', className)} {...props} />;
}

type SkeletonTextProps = {
    lines?: number;
    className?: string;
};

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
    return (
        <div className={cx('sn-skeleton-text', className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton key={index} variant="text" data-width={index === lines - 1 ? 'narrow' : undefined} />
            ))}
        </div>
    );
}

export { skeletonVariants };
export default Skeleton;
