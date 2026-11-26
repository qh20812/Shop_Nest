import { Maximize2, Minimize2, ShieldCheck, Trash2 } from 'lucide-react';
import * as React from 'react';

import { ChatComposer } from '@/components/chat/ChatComposer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList, type MessageListItem } from '@/components/chat/MessageList';
import { QuickReplies } from '@/components/chat/QuickReplies';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './chat.module.css';

type ChatbotPanelProps = {
    messages: MessageListItem[];
    onSend: (message: string) => void;
    onClose: () => void;
    onMinimize?: () => void;
    typing?: boolean;
    loading?: boolean;
    error?: string | null;
    onDismissError?: () => void;
    onClearHistory?: () => void;
    clearing?: boolean;
    expanded?: boolean;
    onToggleExpanded?: () => void;
    quickReplies?: Array<string | { id?: string; label: string; value?: string }>;
    className?: string;
};

const defaultQuickReplyKeys = ['Track my order', 'Return policy', 'Product advice'];

export function ChatbotPanel({
    messages,
    onSend,
    onClose,
    onMinimize,
    typing = false,
    loading = false,
    error,
    onDismissError,
    onClearHistory,
    clearing = false,
    expanded = false,
    onToggleExpanded,
    quickReplies,
    className,
}: ChatbotPanelProps) {
    const { t } = useTranslation();
    const resolvedQuickReplies = quickReplies ?? defaultQuickReplyKeys.map((key) => t(key));
    const [draft, setDraft] = React.useState('');
    const [confirmingClear, setConfirmingClear] = React.useState(false);

    const send = (value: string) => {
        const trimmed = value.trim();

        if (trimmed === '' || typing) {
            return;
        }

        setConfirmingClear(false);
        onSend(trimmed);
        setDraft('');
    };

    const handleClear = () => {
        if (!onClearHistory || clearing) {
            return;
        }

        setConfirmingClear(false);
        onClearHistory();
    };

    return (
        <div className={cx(styles.panel, className)}>
            <ChatHeader
                variant="assistant"
                title={t('ShopNest assistant')}
                subtitle={t('Online')}
                online
                onClose={onClose}
                onMinimize={onMinimize}
                actions={
                    onToggleExpanded || onClearHistory ? (
                        <>
                            {onToggleExpanded ? (
                                <IconButton
                                    label={t(expanded ? 'Collapse chat' : 'Expand chat')}
                                    tooltip={t(expanded ? 'Collapse chat' : 'Expand chat')}
                                    variant="ghost"
                                    size="sm"
                                    onClick={onToggleExpanded}
                                >
                                    {expanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
                                </IconButton>
                            ) : null}
                            {onClearHistory ? (
                                <IconButton
                                    label={t('Clear conversation')}
                                    tooltip={t('Clear conversation')}
                                    variant="ghost"
                                    size="sm"
                                    disabled={clearing}
                                    onClick={() => setConfirmingClear((current) => !current)}
                                >
                                    <Trash2 aria-hidden="true" />
                                </IconButton>
                            ) : null}
                        </>
                    ) : null
                }
            />

            <MessageList
                messages={messages}
                loading={loading}
                typing={typing}
                typingLabel={t('Assistant is typing')}
                emptyTitle={t('Hi!')}
                emptyDescription={t('Ask me about your order, returns or picking the right product.')}
            />

            <div className={styles.panelFooter}>
                {error ? <Alert tone="danger" title={t('The assistant is busy')} description={error} onDismiss={onDismissError} /> : null}

                {confirmingClear ? (
                    <div className={styles.clearConfirm} role="alert">
                        <span className={styles.clearConfirmText}>{t('Clear the whole conversation? This cannot be undone.')}</span>
                        <div className={styles.clearConfirmActions}>
                            <Button type="button" size="sm" variant="destructive" loading={clearing} onClick={handleClear}>
                                {t('Clear')}
                            </Button>
                            <Button type="button" size="sm" variant="ghost" disabled={clearing} onClick={() => setConfirmingClear(false)}>
                                {t('Cancel')}
                            </Button>
                        </div>
                    </div>
                ) : null}

                <QuickReplies items={resolvedQuickReplies} onSelect={send} disabled={typing} />

                <ChatComposer
                    value={draft}
                    onChange={setDraft}
                    onSend={() => send(draft)}
                    loading={typing}
                    disabled={typing}
                    placeholder={t('Ask the ShopNest assistant...')}
                />

                <p className={styles.panelNote}>
                    <ShieldCheck aria-hidden="true" className={styles.panelNoteIcon} />
                    {t('The assistant can make mistakes. Verify important details before ordering.')}
                </p>
            </div>
        </div>
    );
}

export type { ChatbotPanelProps };
export default ChatbotPanel;
