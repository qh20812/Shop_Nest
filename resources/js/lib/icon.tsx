import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

/**
 * Legacy workspace wrappers still receive Boxicons class names. Pages migrated
 * in Phase 7 pass Lucide components instead. Both render here until Phase 8
 * removes the remaining Boxicons strings from Admin.
 */
export type IconProp = LucideIcon | string;

export function renderIcon(icon: IconProp | undefined | null, className?: string): React.ReactNode {
    if (!icon) {
        return null;
    }

    if (typeof icon === 'string') {
        return <i className={icon.startsWith('bx') ? icon : `bx ${icon}`} aria-hidden="true" />;
    }

    const Icon = icon;

    return <Icon aria-hidden="true" className={className} />;
}
