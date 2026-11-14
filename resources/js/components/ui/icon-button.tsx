import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

import Tooltip from './Tooltip';

const iconButtonVariants = cva(
    'inline-flex items-center justify-center rounded-control border transition-[background-color,border-color,color,transform] duration-150 ease-nep focus-ring active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                ghost: 'border-transparent text-ink-muted hover:bg-lacquer-wash hover:text-ink',
                secondary: 'border-border bg-warm-porcelain text-ink hover:bg-lacquer-wash',
                primary: 'border-lacquer-red bg-lacquer-red text-warm-porcelain hover:bg-lacquer-deep',
                danger: 'border-transparent text-ink-muted hover:bg-brick-soft hover:text-brick',
            },
            size: {
                sm: 'size-control-sm [&_svg]:size-4',
                md: 'size-control-md [&_svg]:size-5',
                lg: 'size-control-lg [&_svg]:size-5',
            },
        },
        defaultVariants: {
            variant: 'ghost',
            size: 'md',
        },
    },
);

type IconButtonProps = React.ComponentProps<'button'> &
    VariantProps<typeof iconButtonVariants> & {
        label: string;
        tooltip?: string;
    };

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, variant = 'ghost', size = 'md', label, tooltip, type = 'button', ...props }, ref) => {
        const button = (
            <button
                ref={ref}
                type={type}
                data-slot="icon-button"
                aria-label={label}
                title={tooltip ?? label}
                className={cn(iconButtonVariants({ variant, size }), className)}
                {...props}
            />
        );

        if (!tooltip) {
            return button;
        }

        return <Tooltip content={tooltip}>{button}</Tooltip>;
    },
);

IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
export type { IconButtonProps };
