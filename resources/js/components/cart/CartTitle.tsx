import React from 'react';

interface CartTitleProps {
  title: string;
}

export default function CartTitle({ title }: CartTitleProps) {
  return (
    <div className="bg-[var(--light-2)] p-5 rounded-lg mb-4 shadow-sm">
      <h1 className="text-2xl font-semibold text-[var(--dark)] m-0 font-['Poppins',sans-serif]">
        {title}
      </h1>
    </div>
  );
}