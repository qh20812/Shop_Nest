import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
};

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
    ({ className, label, description, id, ...props }, ref) => {
        const generatedId = React.useId();
        const checkboxId = id ?? generatedId;
        const descriptionId = description ? `${checkboxId}-description` : undefined;

        const control = (
            <CheckboxPrimitive.Root
                ref={ref}
                id={checkboxId}
                data-slot="checkbox"
                aria-describedby={descriptionId}
                className={cn(
                    'peer size-4 shrink-0 rounded-checkbox border border-border bg-warm-porcelain text-warm-porcelain transition-colors duration-150 ease-nep focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-lacquer-red data-[state=checked]:bg-lacquer-red data-[state=indeterminate]:border-lacquer-red data-[state=indeterminate]:bg-lacquer-red',
                    className,
                )}
                {...props}
            >
                <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
                    {props.checked === 'indeterminate' ? (
                        <Minus aria-hidden="true" className="size-3" strokeWidth={3} />
                    ) : (
                        <Check aria-hidden="true" className="size-3" strokeWidth={3} />
                    )}
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
        );

        if (!label && !description) {
            return control;
        }

        return (
            <div className="flex items-start gap-3">
                <div className="pt-0.5">{control}</div>
                <div className="flex flex-col gap-0.5">
                    {label && (
                        <label htmlFor={checkboxId} className="cursor-pointer text-body-sm font-medium text-ink">
                            {label}
                        </label>
                    )}
                    {description && (
                        <span id={descriptionId} className="text-body-sm text-ink-muted">
                            {description}
                        </span>
                    )}
                </div>
            </div>
        );
    },
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export type { CheckboxProps };
export default Checkbox;
