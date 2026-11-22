import * as React from 'react';

import { cx } from '@/lib/cx';

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
            <label htmlFor={inputId} data-disabled={disabled ? 'true' : undefined} className={cx('sn-radio-card', className)}>
                <input
                    ref={ref}
                    id={inputId}
                    type="radio"
                    value={value}
                    disabled={disabled}
                    aria-describedby={descriptionId}
                    className="sn-radio-card__input"
                    {...props}
                />
                <span aria-hidden="true" className="sn-radio-card__mark" />
                <span className="sn-radio-card__body">
                    <span className="sn-radio-card__head">
                        <span className="sn-radio-card__title">{title}</span>
                        {meta && <span className="sn-radio-card__meta">{meta}</span>}
                    </span>
                    {description && (
                        <span id={descriptionId} className="sn-radio-card__description">
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
