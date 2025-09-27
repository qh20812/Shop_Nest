import React from 'react';
import InputError from './InputError';

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
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && ' *'}
      </label>
      
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`form-input-field ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`form-input-field ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
        />
      )}
      
      <InputError message={error} />
    </div>
  );
}
