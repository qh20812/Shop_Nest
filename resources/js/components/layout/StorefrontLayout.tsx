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
     * Legacy pages still use the light Nếp palette until Phase 4/6. Pin the
     * whole shell to light so header, footer and content share one theme.
     * Phase 4 storefront pages opt out; Account/Cart/Checkout keep the pin
     * until Phase 6.
     */
    pinLight?: boolean;
    className?: string;
};

export function StorefrontLayout({ children, compactFooter = false, showChatDock = true, pinLight = true, className }: StorefrontLayoutProps) {
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
