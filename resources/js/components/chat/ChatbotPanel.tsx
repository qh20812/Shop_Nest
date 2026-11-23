import { ShieldCheck, Trash2 } from 'lucide-react';
import * as React from 'react';

import { ChatComposer } from '@/components/chat/ChatComposer';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageList, type MessageListItem } from '@/components/chat/MessageList';
import { QuickReplies } from '@/components/chat/QuickReplies';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { cx } from '@/lib/cx';

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
    quickReplies?: Array<string | { id?: string; label: string; value?: string }>;
    className?: string;
};

const defaultQuickReplies = ['Tra cứu đơn hàng', 'Chính sách đổi trả', 'Tư vấn sản phẩm'];

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
    quickReplies = defaultQuickReplies,
    className,
}: ChatbotPanelProps) {
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
                title="Trợ lý ShopNest"
                subtitle="Trực tuyến"
                online
                onClose={onClose}
                onMinimize={onMinimize}
                actions={
                    onClearHistory ? (
                        <IconButton
                            label="Xoá hội thoại"
                            tooltip="Xoá hội thoại"
                            variant="ghost"
                            size="sm"
                            disabled={clearing}
                            onClick={() => setConfirmingClear((current) => !current)}
                        >
                            <Trash2 aria-hidden="true" />
                        </IconButton>
                    ) : null
                }
            />

            <MessageList
                messages={messages}
                loading={loading}
                typing={typing}
                typingLabel="Trợ lý đang soạn tin"
                emptyTitle="Xin chào!"
                emptyDescription="Hỏi mình về đơn hàng, đổi trả hoặc chọn sản phẩm phù hợp."
            />

            <div className={styles.panelFooter}>
                {error ? <Alert tone="danger" title="Trợ lý đang bận" description={error} onDismiss={onDismissError} /> : null}

                {confirmingClear ? (
                    <div className={styles.clearConfirm} role="alert">
                        <span className={styles.clearConfirmText}>Xoá toàn bộ hội thoại? Thao tác này không thể hoàn tác.</span>
                        <div className={styles.clearConfirmActions}>
                            <Button type="button" size="sm" variant="destructive" loading={clearing} onClick={handleClear}>
                                Xoá
                            </Button>
                            <Button type="button" size="sm" variant="ghost" disabled={clearing} onClick={() => setConfirmingClear(false)}>
                                Huỷ
                            </Button>
                        </div>
                    </div>
                ) : null}

                <QuickReplies items={quickReplies} onSelect={send} disabled={typing} />

                <ChatComposer
                    value={draft}
                    onChange={setDraft}
                    onSend={() => send(draft)}
                    loading={typing}
                    disabled={typing}
                    placeholder="Hỏi trợ lý ShopNest..."
                />

                <p className={styles.panelNote}>
                    <ShieldCheck aria-hidden="true" className={styles.panelNoteIcon} />
                    Trợ lý có thể sai sót. Kiểm tra thông tin quan trọng trước khi đặt hàng.
                </p>
            </div>
        </div>
    );
}

export type { ChatbotPanelProps };
export default ChatbotPanel;
