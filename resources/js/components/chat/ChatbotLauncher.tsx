import { MessageCircle } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';

import styles from './chat-launcher.module.css';

type ChatbotLauncherProps = React.ComponentPropsWithoutRef<'button'> & {
    unreadCount?: number;
    open?: boolean;
    className?: string;
};

const ChatbotLauncher = React.forwardRef<HTMLButtonElement, ChatbotLauncherProps>(({ unreadCount = 0, open = false, className, ...props }, ref) => (
    <button
        ref={ref}
        type="button"
        aria-label={open ? 'Đóng trợ lý ShopNest' : 'Mở trợ lý ShopNest'}
        title="Trợ lý ShopNest"
        data-slot="chatbot-launcher"
        className={cx(styles.launcher, className)}
        data-open={open ? 'true' : undefined}
        {...props}
    >
        <MessageCircle aria-hidden="true" className={styles.launcherIcon} strokeWidth={1.75} />
        {unreadCount > 0 ? <span className={styles.launcherBadge}>{unreadCount > 9 ? '9+' : unreadCount}</span> : null}
    </button>
));

ChatbotLauncher.displayName = 'ChatbotLauncher';

export { ChatbotLauncher };
export type { ChatbotLauncherProps };
export default ChatbotLauncher;
