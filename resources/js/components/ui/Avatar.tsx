/** @jsxImportSource react */
import * as React from 'react';

interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar?: string;
  avatar_url?: string;
}

interface AvatarProps {
  user?: User | null;
  src?: string | null;
  alt?: string;
  size?: number;
}

export default function Avatar({ user = null, src = null, alt = 'User', size = 36 }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const getInitials = () => {
    const name = (user && (user.first_name || user.username)) || alt || 'U';
    return String(name).charAt(0).toUpperCase();
  };

  const avatarSrc = src ?? user?.avatar_url ?? user?.avatar ?? null;

  if (avatarSrc && !imageError) {
    return (
      <img
        src={avatarSrc}
        alt={`${alt} avatar`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--grey)',
        }}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--light)',
        fontWeight: '600',
        fontSize: `${size * 0.4}px`,
        border: '2px solid var(--grey)',
      }}
      aria-label={alt}
      role="img"
    >
      {getInitials()}
    </div>
  );
}