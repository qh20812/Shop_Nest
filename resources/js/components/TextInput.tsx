import React, { useEffect, useRef } from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isFocused?: boolean;
}

export default function TextInput({ isFocused = false, className = "", ...props }: TextInputProps) {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && input.current) {
      input.current.focus();
    }
  }, [isFocused]);

  return (
    <input
      {...props}
      ref={input}
      className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
    />
  );
}
