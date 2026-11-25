import * as React from 'react';

import { ChatDock } from '@/components/chat/ChatDock';
import { cx } from '@/lib/cx';

import { StorefrontFooter } from './StorefrontFooter';
import { StorefrontHeader } from './StorefrontHeader';

type StorefrontLayoutProps = {
    children: React.ReactNode;
    compactFooter?: boolean;
    showChatDock?: boolean;
    className?: string;
};

export function StorefrontLayout({ children, compactFooter = false, showChatDock = true, className }: StorefrontLayoutProps) {
    return (
        <div className={cx('sn-shell sn-storefront', className)}>
            <StorefrontHeader />
            <main className="sn-storefront__main">{children}</main>
            <StorefrontFooter compact={compactFooter} />
            {showChatDock && <ChatDock />}
        </div>
    );
}

export default StorefrontLayout;
