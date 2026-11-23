import * as React from 'react';

import { ChatDock } from '@/components/chat/ChatDock';
import { cx } from '@/lib/cx';

import { StorefrontFooter } from './StorefrontFooter';
import { StorefrontHeader } from './StorefrontHeader';

type StorefrontLayoutProps = {
    children: React.ReactNode;
    compactFooter?: boolean;
    showChatDock?: boolean;
    /**
     * Escape hatch kept until Phase 11. Storefront, auth and account shells
     * all follow `data-theme` after Phase 6, so the default is `false`.
     */
    pinLight?: boolean;
    className?: string;
};

export function StorefrontLayout({ children, compactFooter = false, showChatDock = true, pinLight = false, className }: StorefrontLayoutProps) {
    return (
        <div className={cx('sn-shell sn-storefront', className)} data-theme={pinLight ? 'light' : undefined}>
            <StorefrontHeader />
            <main className="sn-storefront__main">{children}</main>
            <StorefrontFooter compact={compactFooter} />
            {showChatDock && <ChatDock />}
        </div>
    );
}

export default StorefrontLayout;
