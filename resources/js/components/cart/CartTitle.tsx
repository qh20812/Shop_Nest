import React from 'react';

interface CartTitleProps {
  title: string;
}

export default function CartTitle({ title }: CartTitleProps) {
  return (
    <div className="cart-title">
      <h1>{title}</h1>
    </div>
  );
}