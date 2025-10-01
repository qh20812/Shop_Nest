import React from 'react';
import AuthButton from './AuthButton';

interface TogglePanelProps {
  type: 'left' | 'right';
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

export default function TogglePanel({
  type,
  title,
  description,
  buttonText,
  onClick,
}: TogglePanelProps) {
  const panelClass = type === 'left' ? 'toggle-panel toggle-left' : 'toggle-panel toggle-right';
  const buttonId = type === 'left' ? 'login' : 'register';

  return (
    <div className={panelClass}>
      <h1>{title}</h1>
      <p>{description}</p>
      <AuthButton text={buttonText} onClick={onClick} id={buttonId}  />
    </div>
  );
}
