import * as React from 'react';

import { cn } from '@/lib/utils';

import { StorefrontFooter } from './StorefrontFooter';
import { StorefrontHeader } from './StorefrontHeader';

type StorefrontLayoutProps = {
    children: React.ReactNode;
    compactFooter?: boolean;
    className?: string;
};

export function StorefrontLayout({ children, compactFooter = false, className }: StorefrontLayoutProps) {
    return (
        <div className={cn('flex min-h-[100dvh] flex-col bg-rice-paper text-ink', className)}>
            <StorefrontHeader />
            <main className="flex-1">{children}</main>
            <StorefrontFooter compact={compactFooter} />
            {/* ChatDock will mount here in Phase 5. */}
        </div>
    );
}

export default StorefrontLayout;
