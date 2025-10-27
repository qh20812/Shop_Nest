import React, { useState, useRef } from 'react';
import Avatar from '@/Components/ui/Avatar';
import { useTranslation } from '../../lib/i18n';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  avatar?: string;
  avatar_url?: string;
}

interface AvatarUploadProps {
  user: User;
  onAvatarChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function AvatarUpload({ user, onAvatarChange, disabled = false }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
const { t } = useTranslation();
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onAvatarChange(file);
    }
  };

//   const handleRemoveAvatar = () => {
//     if (previewUrl) {
//       URL.revokeObjectURL(previewUrl);
//       setPreviewUrl(null);
//     }
//     onAvatarChange(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

  const displayUser = previewUrl 
    ? { ...user, avatar_url: previewUrl } 
    : user;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative' }}>
        <Avatar user={displayUser} size={100} />
        
        {/* Upload/Change Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: 'var(--light)',
            border: '2px solid var(--light)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            opacity: disabled ? 0.6 : 1,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.background = 'var(--dark)';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.background = 'var(--primary)';
            }
          }}
        >
          <i className="bx bx-camera"></i>
        </button>
      </div>

      <div style={{ textAlign: 'center', fontSize: '14px' }}>
        <p style={{ color: 'var(--dark)', margin: '0 0 8px 0', fontWeight: '500' }}>
          {t("Profile Picture")}
        </p>
        {/* <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              textDecoration: 'underline',
              opacity: disabled ? 0.6 : 1
            }}
          >
            {user.avatar_url || user.avatar || previewUrl ? 'Change' : 'Upload'}
          </button>
          
          {(user.avatar_url || user.avatar || previewUrl) && (
            <>
              <span style={{ color: 'var(--dark-grey)' }}>•</span>
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={disabled}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--danger)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  textDecoration: 'underline',
                  opacity: disabled ? 0.6 : 1
                }}
              >
                Remove
              </button>
            </>
          )}
        </div> */}
        <p style={{ color: 'var(--dark-grey)', margin: '4px 0 0 0', fontSize: '12px' }}>
          JPG, PNG {t('or')} GIF ({t('max')} 2MB)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled}
      />
    </div>
  );
}