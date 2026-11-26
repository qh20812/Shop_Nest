import React from 'react';

import { FormField } from './form-field';
import { Input } from './input';
import { Select } from './select';

interface Option {
    value: string | number;
    label: string;
}

interface PrimaryInputProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type?: 'text' | 'email' | 'password' | 'select';
    error?: string;
    placeholder?: string;
    options?: Option[];
    required?: boolean;
    disabled?: boolean;
    autoComplete?: string;
}

/**
 * @deprecated Dùng `FormField` + `Input`/`Select` cho code mới.
 * Wrapper này giữ API cũ cho các form Seller đang dùng.
 */
export default function PrimaryInput({
    label,
    name,
    value,
    onChange,
    type = 'text',
    error,
    placeholder,
    options = [],
    required = false,
    disabled = false,
    autoComplete,
}: PrimaryInputProps) {
    const control =
        type === 'select' ? (
            <Select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                options={options.map((option) => ({ value: String(option.value), label: option.label }))}
            />
        ) : (
            <Input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
            />
        );

    return (
        <FormField htmlFor={name} label={label} required={required} error={error}>
            {control}
        </FormField>
    );
}
