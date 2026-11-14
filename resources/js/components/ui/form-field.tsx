import * as React from 'react';

import { cn } from '@/lib/utils';

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

function FormField({
    children,
    label,
    htmlFor,
    required = false,
    hint,
    error,
    counter,
    className,
    labelAction,
}: FormFieldProps) {
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
        <div className={cn('flex w-full flex-col gap-1.5', className)}>
            {(label || labelAction) && (
                <div className="flex items-center justify-between gap-3">
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
                <span id={errorId} role="alert" className="text-body-sm text-brick">
                    {error}
                </span>
            ) : (
                hint && (
                    <span id={hintId} className="text-body-sm text-ink-muted">
                        {hint}
                    </span>
                )
            )}
            {counter && <span className="self-end font-mono text-label-micro text-ink-faint">{counter}</span>}
        </div>
    );
}

type LabelProps = React.ComponentProps<'label'> & {
    required?: boolean;
};

function Label({ className, required, children, ...props }: LabelProps) {
    return (
        <label className={cn('text-body-sm font-medium text-ink', className)} {...props}>
            {children}
            {required && (
                <span aria-hidden="true" className="ml-0.5 text-lacquer-red">
                    *
                </span>
            )}
        </label>
    );
}

export { FormField, Label };
export type { FormFieldProps, LabelProps };
export default FormField;
