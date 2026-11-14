import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const inputVariants = cva(
    'w-full rounded-control border border-border bg-warm-porcelain font-sans text-ink transition-[border-color,box-shadow] duration-150 ease-nep placeholder:text-ink-faint focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-brick',
    {
        variants: {
            size: {
                sm: 'h-control-sm text-body-sm',
                md: 'h-control-md text-body-md',
                lg: 'h-control-lg text-body-md',
            },
        },
        defaultVariants: {
            size: 'md',
        },
    },
);

type InputProps = Omit<React.ComponentProps<'input'>, 'size'> &
    VariantProps<typeof inputVariants> & {
        invalid?: boolean;
        leadingIcon?: LucideIcon;
        trailing?: React.ReactNode;
    };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', size = 'md', invalid, leadingIcon: LeadingIcon, trailing, ...props }, ref) => {
        const hasLeading = Boolean(LeadingIcon);
        const hasTrailing = Boolean(trailing);

        const input = (
            <input
                ref={ref}
                type={type}
                data-slot="input"
                aria-invalid={invalid || props['aria-invalid']}
                className={cn(
                    inputVariants({ size }),
                    !hasLeading && !hasTrailing && 'px-4',
                    hasLeading && 'pl-11',
                    hasTrailing && 'pr-11',
                    className,
                )}
                {...props}
            />
        );

        if (!hasLeading && !hasTrailing) {
            return input;
        }

        return (
            <div className="relative w-full">
                {LeadingIcon && (
                    <LeadingIcon
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-ink-faint"
                    />
                )}
                {input}
                {trailing && <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>}
            </div>
        );
    },
);

Input.displayName = 'Input';

export { Input, inputVariants };
export type { InputProps };
export default Input;
