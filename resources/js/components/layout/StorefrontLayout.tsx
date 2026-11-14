import * as React from 'react';

import { ChatDock } from '@/components/chat/ChatDock';
import { cn } from '@/lib/utils';

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
        <div className={cn('flex min-h-[100dvh] flex-col bg-rice-paper text-ink', className)}>
            <StorefrontHeader />
            <main className="flex-1">{children}</main>
            <StorefrontFooter compact={compactFooter} />
            {showChatDock && <ChatDock />}
        </div>
    );
}

export default StorefrontLayout;
