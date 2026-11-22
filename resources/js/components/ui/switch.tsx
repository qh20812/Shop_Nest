import * as React from 'react';

import { cx } from '@/lib/cx';

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
                className={cx('sn-switch', className)}
                {...props}
            >
                <span aria-hidden="true" className="sn-switch__thumb" />
            </button>
        );

        if (!label && !description) {
            return control;
        }

        return (
            <div className="sn-switch-field">
                <div className="sn-switch-field__copy">
                    {label && (
                        <label htmlFor={switchId} className="sn-switch-field__label">
                            {label}
                        </label>
                    )}
                    {description && (
                        <span id={descriptionId} className="sn-switch-field__description">
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
