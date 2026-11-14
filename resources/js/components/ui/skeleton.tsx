import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const skeletonVariants = cva('animate-pulse bg-raw-linen', {
    variants: {
        variant: {
            text: 'h-3 w-full rounded-chip',
            title: 'h-5 w-2/3 rounded-chip',
            rect: 'h-24 w-full rounded-control',
            circle: 'size-10 rounded-pill',
            button: 'h-control-md w-32 rounded-control',
        },
    },
    defaultVariants: {
        variant: 'text',
    },
});

type SkeletonProps = React.ComponentProps<'div'> & VariantProps<typeof skeletonVariants>;

export function Skeleton({ className, variant, ...props }: SkeletonProps) {
    return <div aria-hidden="true" className={cn(skeletonVariants({ variant }), className)} {...props} />;
}

type SkeletonTextProps = {
    lines?: number;
    className?: string;
};

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton key={index} variant="text" className={index === lines - 1 ? 'w-4/5' : undefined} />
            ))}
        </div>
    );
}

export { skeletonVariants };
export default Skeleton;
