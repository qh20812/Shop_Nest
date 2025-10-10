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

  // safe avatar source: prefer explicit src, then user.avatar_url, then user.avatar
  const avatarSrc = src ?? (user ? (user.avatar_url ?? user.avatar ?? null) : null);

  const getInitials = () => {
    const name =
      (user && (user.first_name || user.last_name || user.username)) ||
      String(alt || 'U');
    const parts = String(name).trim().split(/\s+/);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (avatarSrc && !imageError) {
    return (
      <img
        src={avatarSrc}
        alt={`${alt} avatar`}
        width={size}
        height={size}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'inline-block',
        }}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      role="img"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: '#374151',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 600,
        fontSize: `${Math.max(12, size * 0.4)}px`,
        userSelect: 'none',
      }}
    >
      {getInitials()}
    </div>
  );
}