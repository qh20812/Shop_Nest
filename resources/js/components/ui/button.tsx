import { Slot } from '@radix-ui/react-slot';
import { Loader2, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'tertiary' | 'destructive' | 'link';
type ButtonSize = 'default' | 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg';

type ButtonVariantProps = { variant?: ButtonVariant; size?: ButtonSize };

/**
 * Compatibility helper for code that imported `buttonVariants`.
 * Styling is now driven by `data-variant` / `data-size`, not class names.
 */
const buttonVariants: (props?: ButtonVariantProps) => string = () => 'sn-btn';

type ButtonProps = React.ComponentProps<'button'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
    loading?: boolean;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'default',
            size = 'default',
            asChild = false,
            loading = false,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            disabled,
            children,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : 'button';
        const content = asChild ? (
            children
        ) : (
            <>
                {loading ? <Loader2 aria-hidden="true" className="sn-btn__spinner" /> : LeftIcon && <LeftIcon aria-hidden="true" />}
                {children}
                {!loading && RightIcon && <RightIcon aria-hidden="true" />}
            </>
        );

        return (
            <Comp
                ref={ref}
                data-slot="button"
                data-variant={variant}
                data-size={size}
                aria-busy={loading || undefined}
                disabled={disabled || loading}
                className={cx('sn-btn', className)}
                {...props}
            >
                {content}
            </Comp>
        );
    },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps, ButtonSize, ButtonVariant };
