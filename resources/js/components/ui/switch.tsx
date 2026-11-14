import * as React from 'react';

import { cn } from '@/lib/utils';

type SwitchProps = Omit<React.ComponentProps<'button'>, 'onChange'> & {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: React.ReactNode;
    description?: React.ReactNode;
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, checked, onCheckedChange, label, description, disabled, id, onClick, ...props }, ref) => {
        const generatedId = React.useId();
        const switchId = id ?? generatedId;
        const descriptionId = description ? `${switchId}-description` : undefined;

        const control = (
            <button
                ref={ref}
                id={switchId}
                type="button"
                role="switch"
                aria-checked={checked}
                aria-describedby={descriptionId}
                data-slot="switch"
                data-state={checked ? 'checked' : 'unchecked'}
                disabled={disabled}
                onClick={(event) => {
                    onClick?.(event);

                    if (!event.defaultPrevented) {
                        onCheckedChange(!checked);
                    }
                }}
                className={cn(
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-pill border border-border bg-raw-linen transition-colors duration-150 ease-nep focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-lacquer-red data-[state=checked]:bg-lacquer-red',
                    className,
                )}
                {...props}
            >
                <span
                    aria-hidden="true"
                    className={cn(
                        'block size-5 rounded-pill border border-border bg-warm-porcelain transition-transform duration-150 ease-nep',
                        checked ? 'translate-x-5' : 'translate-x-0.5',
                    )}
                />
            </button>
        );

        if (!label && !description) {
            return control;
        }

        return (
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                    {label && (
                        <label htmlFor={switchId} className="cursor-pointer text-body-sm font-semibold text-ink">
                            {label}
                        </label>
                    )}
                    {description && (
                        <span id={descriptionId} className="text-body-sm text-ink-muted">
                            {description}
                        </span>
                    )}
                </div>
                {control}
            </div>
        );
    },
);

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
export default Switch;
