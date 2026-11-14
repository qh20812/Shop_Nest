import * as React from 'react';

import { cn } from '@/lib/utils';

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

const sizeClasses: Record<AvatarSize, string> = {
    sm: 'size-8 text-body-sm',
    md: 'size-10 text-body-md',
    lg: 'size-12 text-body-md',
    xl: 'size-16 text-headline-3',
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
        <span
            className={cn(
                'relative inline-flex shrink-0 items-center justify-center',
                typeof size === 'number' ? '' : sizeClasses[size],
                className,
            )}
            style={dimensionStyle}
        >
            {resolvedSrc && !imageError ? (
                <img
                    src={resolvedSrc}
                    alt={resolvedName}
                    className="size-full rounded-pill border border-border object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span
                    aria-label={resolvedName}
                    className="flex size-full items-center justify-center rounded-pill border border-border bg-lacquer-wash font-semibold text-lacquer-deep"
                    style={textStyle}
                >
                    {getInitials(resolvedName)}
                </span>
            )}
            {status && (
                <span
                    aria-label={status}
                    className={cn(
                        'absolute bottom-0 right-0 size-2.5 rounded-pill ring-2 ring-warm-porcelain',
                        status === 'online' && 'bg-jade',
                        status === 'away' && 'bg-turmeric',
                        status === 'offline' && 'bg-ink-faint',
                    )}
                />
            )}
        </span>
    );
}

export default Avatar;
