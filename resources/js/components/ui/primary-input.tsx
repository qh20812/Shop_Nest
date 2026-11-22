import { ChevronDown } from 'lucide-react';
import React from 'react';

import InputError from './input-error';

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
    return (
        <div className="sn-field">
            <label className="sn-field__label" htmlFor={name}>
                {label}
                {required && (
                    <span aria-hidden="true" className="sn-field__required">
                        *
                    </span>
                )}
            </label>

            {type === 'select' ? (
                <span className="sn-select-wrap">
                    <select
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        aria-invalid={error ? true : undefined}
                        className="sn-select"
                    >
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown aria-hidden="true" className="sn-select__icon" />
                </span>
            ) : (
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    aria-invalid={error ? true : undefined}
                    className="sn-input"
                />
            )}

            <InputError message={error} />
        </div>
    );
}
