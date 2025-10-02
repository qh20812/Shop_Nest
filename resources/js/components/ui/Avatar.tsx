import React from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username?: string;
  avatar?: string;
  avatar_url?: string;
}

interface AvatarProps {
  user: User;
  size?: number;
}

export default function Avatar({ user, size = 36 }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  // Generate initials from first_name or username
  const getInitials = () => {
    const name = user.first_name || user.username || 'U';
    return name.charAt(0).toUpperCase();
  };

  // Use avatar_url if available, fallback to avatar
  const avatarSrc = user.avatar_url || user.avatar;
  
  // If user has avatar and no image error, show the avatar image
  if (avatarSrc && !imageError) {
    return (
      <img
        src={avatarSrc}
        alt={`${user.first_name || user.username || 'User'} avatar`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid var(--grey)"
        }}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback to initials avatar
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
        fontSize: `${size * 0.4}px`,
        border: "2px solid var(--grey)"
      }}
    >
      {getInitials()}
    </div>
  );
}
