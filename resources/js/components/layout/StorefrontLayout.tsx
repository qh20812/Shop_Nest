import * as React from 'react';

import { ChatDock } from '@/components/chat/ChatDock';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import { StorefrontFooter } from './StorefrontFooter';
import { StorefrontHeader } from './StorefrontHeader';

type StorefrontLayoutProps = {
    children: React.ReactNode;
    compactFooter?: boolean;
    footerClassName?: string;
    showChatDock?: boolean;
    className?: string;
};

export function StorefrontLayout({ children, compactFooter = false, footerClassName, showChatDock = true, className }: StorefrontLayoutProps) {
    const { t } = useTranslation();

    return (
        <div className={cx('sn-shell sn-storefront', className)}>
            <a href="#main-content" className="sn-skip-link">
                {t('Skip to main content')}
            </a>
            <StorefrontHeader />
            <main id="main-content" tabIndex={-1} className="sn-storefront__main">
                {children}
            </main>
            <StorefrontFooter compact={compactFooter} className={footerClassName} />
            {showChatDock && <ChatDock />}
        </div>
    );
}

export default StorefrontLayout;
