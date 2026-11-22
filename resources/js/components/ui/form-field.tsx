import * as React from 'react';

import { cx } from '@/lib/cx';

type FieldControlProps = {
    id?: string;
    'aria-invalid'?: boolean | 'true' | 'false';
    'aria-describedby'?: string;
};

type FormFieldProps = {
    children: React.ReactElement<FieldControlProps>;
    label?: React.ReactNode;
    htmlFor?: string;
    required?: boolean;
    hint?: React.ReactNode;
    error?: React.ReactNode;
    counter?: React.ReactNode;
    className?: string;
    labelAction?: React.ReactNode;
};

function FormField({ children, label, htmlFor, required = false, hint, error, counter, className, labelAction }: FormFieldProps) {
    const generatedId = React.useId();
    const fieldId = htmlFor ?? children.props.id ?? generatedId;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    const control = React.cloneElement(children, {
        id: fieldId,
        'aria-invalid': error ? true : children.props['aria-invalid'],
        'aria-describedby': describedBy ?? children.props['aria-describedby'],
    });

    return (
        <div className={cx('sn-field', className)}>
            {(label || labelAction) && (
                <div className="sn-field__head">
                    {label && (
                        <Label htmlFor={fieldId} required={required}>
                            {label}
                        </Label>
                    )}
                    {labelAction}
                </div>
            )}
            {control}
            {error ? (
                <span id={errorId} role="alert" className="sn-field__error">
                    {error}
                </span>
            ) : (
                hint && (
                    <span id={hintId} className="sn-field__hint">
                        {hint}
                    </span>
                )
            )}
            {counter && <span className="sn-field__counter">{counter}</span>}
        </div>
    );
}

type LabelProps = React.ComponentProps<'label'> & {
    required?: boolean;
};

function Label({ className, required, children, ...props }: LabelProps) {
    return (
        <label className={cx('sn-field__label', className)} {...props}>
            {children}
            {required && (
                <span aria-hidden="true" className="sn-field__required">
                    *
                </span>
            )}
        </label>
    );
}

export { FormField, Label };
export type { FormFieldProps, LabelProps };
export default FormField;
