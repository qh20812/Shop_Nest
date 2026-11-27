import { MessageCircle } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './chat-launcher.module.css';

type ChatbotLauncherProps = React.ComponentPropsWithoutRef<'button'> & {
    unreadCount?: number;
    open?: boolean;
    className?: string;
};

const ChatbotLauncher = React.forwardRef<HTMLButtonElement, ChatbotLauncherProps>(({ unreadCount = 0, open = false, className, ...props }, ref) => {
    const { t } = useTranslation();

    return (
        <button
            ref={ref}
            type="button"
            aria-label={open ? t('Close the ShopNest assistant') : t('Open the ShopNest assistant')}
            title={t('ShopNest assistant')}
            data-slot="chatbot-launcher"
            className={cx(styles.launcher, className)}
            data-open={open ? 'true' : undefined}
            {...props}
        >
            <MessageCircle aria-hidden="true" className={styles.launcherIcon} strokeWidth={1.75} />
            {unreadCount > 0 ? <span className={styles.launcherBadge}>{unreadCount > 9 ? '9+' : unreadCount}</span> : null}
        </button>
    );
});

ChatbotLauncher.displayName = 'ChatbotLauncher';

export { ChatbotLauncher };
export type { ChatbotLauncherProps };
export default ChatbotLauncher;
