import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

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
                className={cx('sn-checkbox', className)}
                {...props}
            >
                <CheckboxPrimitive.Indicator className="sn-checkbox__indicator">
                    {props.checked === 'indeterminate' ? (
                        <Minus aria-hidden="true" className="sn-checkbox__icon" strokeWidth={3} />
                    ) : (
                        <Check aria-hidden="true" className="sn-checkbox__icon" strokeWidth={3} />
                    )}
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
        );

        if (!label && !description) {
            return control;
        }

        return (
            <div className="sn-checkbox-field">
                <div className="sn-checkbox-field__control">{control}</div>
                <div className="sn-checkbox-field__copy">
                    {label && (
                        <label htmlFor={checkboxId} className="sn-checkbox-field__label">
                            {label}
                        </label>
                    )}
                    {description && (
                        <span id={descriptionId} className="sn-checkbox-field__description">
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
