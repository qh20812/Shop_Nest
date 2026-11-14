import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control border font-sans font-medium transition-[background-color,border-color,color,transform] duration-150 ease-nep focus-ring active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'border-lacquer-red bg-lacquer-red text-warm-porcelain hover:border-lacquer-deep hover:bg-lacquer-deep',
                primary:
                    'border-lacquer-red bg-lacquer-red text-warm-porcelain hover:border-lacquer-deep hover:bg-lacquer-deep',
                secondary: 'border-border bg-transparent text-ink hover:bg-lacquer-wash',
                outline: 'border-border bg-warm-porcelain text-ink hover:bg-lacquer-wash',
                ghost: 'border-transparent text-ink hover:bg-lacquer-wash',
                tertiary:
                    'border-transparent text-lacquer-red underline decoration-1 underline-offset-4 hover:text-lacquer-deep',
                destructive: 'border-brick bg-brick text-warm-porcelain hover:border-lacquer-deep hover:bg-lacquer-deep',
                link: 'border-transparent text-lacquer-red underline-offset-4 hover:underline',
            },
            size: {
                sm: 'h-control-sm px-3 text-body-sm [&_svg]:size-4',
                default: 'h-control-md px-5 text-body-sm [&_svg]:size-4',
                md: 'h-control-md px-5 text-body-sm [&_svg]:size-4',
                lg: 'h-control-lg px-6 text-body-md [&_svg]:size-5',
                icon: 'size-control-md p-0 [&_svg]:size-4',
                'icon-sm': 'size-control-sm p-0 [&_svg]:size-4',
                'icon-lg': 'size-control-lg p-0 [&_svg]:size-5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

type ButtonProps = React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
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
                {loading ? (
                    <Loader2 aria-hidden="true" className="animate-spin" />
                ) : (
                    LeftIcon && <LeftIcon aria-hidden="true" />
                )}
                {children}
                {!loading && RightIcon && <RightIcon aria-hidden="true" />}
            </>
        );

        return (
            <Comp
                ref={ref}
                data-slot="button"
                aria-busy={loading || undefined}
                disabled={disabled || loading}
                className={cn(buttonVariants({ variant, size }), className)}
                {...props}
            >
                {content}
            </Comp>
        );
    },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
