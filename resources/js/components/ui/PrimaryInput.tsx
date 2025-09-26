import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface PrimaryInputProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: 'text' | 'email' | 'select';
  error?: string;
  placeholder?: string;
  options?: Option[];
  required?: boolean;
  disabled?: boolean;
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
          className={`form-input-field ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
        />
      )}
      
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
