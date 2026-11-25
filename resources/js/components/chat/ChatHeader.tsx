import { ArrowLeft, ChevronDown, Sparkles, Store, X } from 'lucide-react';
import * as React from 'react';

import Avatar from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/icon-button';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './chat.module.css';

type ChatHeaderProps = {
    variant?: 'assistant' | 'shop';
    title: string;
    subtitle?: string;
    online?: boolean;
    avatar?: string | null;
    onClose?: () => void;
    onMinimize?: () => void;
    onBack?: () => void;
    actions?: React.ReactNode;
    className?: string;
};

export function ChatHeader({
    variant = 'shop',
    title,
    subtitle,
    online = false,
    avatar,
    onClose,
    onMinimize,
    onBack,
    actions,
    className,
}: ChatHeaderProps) {
    const { t } = useTranslation();
    return (
        <header className={cx(styles.header, className)}>
            {onBack ? (
                <IconButton label={t('Go back')} variant="ghost" size="sm" onClick={onBack} className={styles.headerBack}>
                    <ArrowLeft aria-hidden="true" />
                </IconButton>
            ) : null}

            {variant === 'assistant' ? (
                <span className={styles.headerIcon}>
                    <Sparkles aria-hidden="true" />
                </span>
            ) : (
                <Avatar name={title} src={avatar} size="md" />
            )}

            <div className={styles.headerBody}>
                <div className={styles.headerTitleRow}>
                    <span className={styles.headerTitle}>{title}</span>
                    {variant === 'assistant' ? (
                        <Badge tone="accent" size="sm">
                            AI
                        </Badge>
                    ) : null}
                </div>
                <span className={styles.headerSubtitle}>
                    {online ? (
                        <span aria-hidden="true" className={styles.headerStatusDot} />
                    ) : (
                        <Store aria-hidden="true" className={styles.headerStoreIcon} />
                    )}
                    {subtitle ?? (variant === 'assistant' ? t('Online') : online ? t('Online now') : t('Offline'))}
                </span>
            </div>

            <div className={styles.headerActions}>
                {actions}
                {onMinimize ? (
                    <IconButton label={t('Minimize chat')} variant="ghost" size="sm" onClick={onMinimize}>
                        <ChevronDown aria-hidden="true" />
                    </IconButton>
                ) : null}
                {onClose ? (
                    <IconButton label={t('Close chat')} variant="ghost" size="sm" onClick={onClose}>
                        <X aria-hidden="true" />
                    </IconButton>
                ) : null}
            </div>
        </header>
    );
}

export type { ChatHeaderProps };
export default ChatHeader;
