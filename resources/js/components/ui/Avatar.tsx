import React from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

interface AvatarProps {
  user: User;
  size?: number;
}

export default function Avatar({ user, size = 36 }: AvatarProps) {
  return (
    <div 
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "var(--primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--light)",
        fontWeight: "600",
        fontSize: `${size * 0.4}px`
      }}
    >
      {user.first_name.charAt(0).toUpperCase()}
    </div>
  );
}
