import React from 'react';

interface InputErrorProps {
  message?: string;
}

export default function InputError({ message }: InputErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p className="form-error">{message}</p>
  );
}
