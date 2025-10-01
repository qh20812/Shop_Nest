import React from 'react';

interface AuthInputProps {
  type: string;
  placeholder: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function AuthInput({ 
  type, 
  placeholder, 
  name, 
  value, 
  onChange,
  className = '',
  ...props 
}: AuthInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    />
  );
}