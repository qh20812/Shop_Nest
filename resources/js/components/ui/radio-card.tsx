import * as React from 'react';

import { cn } from '@/lib/utils';

type RadioCardProps = Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'title'> & {
    value: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    meta?: React.ReactNode;
    children?: React.ReactNode;
};

const RadioCard = React.forwardRef<HTMLInputElement, RadioCardProps>(
    ({ className, id, value, title, description, meta, children, disabled, ...props }, ref) => {
        const generatedId = React.useId();
        const inputId = id ?? generatedId;
        const descriptionId = description ? `${inputId}-description` : undefined;

        return (
            <label
                htmlFor={inputId}
                className={cn(
                    'group relative flex cursor-pointer items-start gap-3 rounded-card border border-border bg-warm-porcelain p-4 transition-[border-color,background-color] duration-150 ease-nep hover:border-ink-muted has-[:checked]:border-lacquer-red has-[:checked]:bg-lacquer-wash/30 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-lacquer-red has-[:focus-visible]:ring-offset-2',
                    disabled && 'cursor-not-allowed opacity-50',
                    className,
                )}
            >
                <input
                    ref={ref}
                    id={inputId}
                    type="radio"
                    value={value}
                    disabled={disabled}
                    aria-describedby={descriptionId}
                    className="peer sr-only"
                    {...props}
                />
                <span
                    aria-hidden="true"
                    className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-pill border border-border bg-warm-porcelain peer-checked:border-lacquer-red peer-checked:bg-lacquer-red after:size-1.5 after:rounded-pill after:bg-warm-porcelain after:opacity-0 peer-checked:after:opacity-100"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-start justify-between gap-3">
                        <span className="text-body-md font-medium text-ink">{title}</span>
                        {meta && <span className="shrink-0 text-body-sm text-ink-muted">{meta}</span>}
                    </span>
                    {description && (
                        <span id={descriptionId} className="text-body-sm text-ink-muted">
                            {description}
                        </span>
                    )}
                    {children}
                </span>
            </label>
        );
    },
);

RadioCard.displayName = 'RadioCard';

export { RadioCard };
export type { RadioCardProps };
export default RadioCard;
