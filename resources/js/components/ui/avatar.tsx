import * as React from 'react';

import { cx } from '@/lib/cx';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

type LegacyUser = {
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
};

type AvatarProps = {
    user?: LegacyUser;
    src?: string | null;
    name?: string;
    size?: AvatarSize | number;
    status?: 'online' | 'offline' | 'away';
    className?: string;
};

function getInitials(name?: string): string {
    if (!name) {
        return 'U';
    }

    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return 'U';
    }

    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function Avatar({ user, src, name, size = 'md', status, className }: AvatarProps) {
    const [imageError, setImageError] = React.useState(false);

    const derivedName = [user?.last_name, user?.first_name].filter(Boolean).join(' ') || user?.username || 'Người dùng';
    const resolvedName = name ?? derivedName;

    let resolvedSrc = src ?? user?.avatar_url ?? user?.avatar ?? null;

    if (resolvedSrc && !resolvedSrc.startsWith('http') && !resolvedSrc.startsWith('/')) {
        resolvedSrc = `/storage/${resolvedSrc}`;
    }

    React.useEffect(() => {
        setImageError(false);
    }, [resolvedSrc]);

    const numericSize = typeof size === 'number' ? size : null;
    const dimensionStyle = numericSize ? { width: numericSize, height: numericSize } : undefined;
    const textStyle = numericSize ? { fontSize: Math.max(12, numericSize * 0.4) } : undefined;

    return (
        <span data-slot="avatar" data-size={numericSize ? undefined : size} className={cx('sn-avatar', className)} style={dimensionStyle}>
            {resolvedSrc && !imageError ? (
                <img src={resolvedSrc} alt={resolvedName} className="sn-avatar__image" onError={() => setImageError(true)} />
            ) : (
                <span aria-label={resolvedName} className="sn-avatar__fallback" style={textStyle}>
                    {getInitials(resolvedName)}
                </span>
            )}
            {status && <span aria-label={status} data-status={status} className="sn-avatar__status" />}
        </span>
    );
}

export default Avatar;
