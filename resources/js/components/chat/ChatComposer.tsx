import { Send, Smile } from 'lucide-react';
import * as React from 'react';

import { IconButton } from '@/components/ui/icon-button';
import Textarea from '@/components/ui/textarea';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import styles from './chat.module.css';

type ChatComposerProps = {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
    loading?: boolean;
    placeholder?: string;
    maxLength?: number;
    onEmoji?: () => void;
    className?: string;
};

export function ChatComposer({
    value,
    onChange,
    onSend,
    disabled = false,
    loading = false,
    placeholder,
    maxLength = 500,
    onEmoji,
    className,
}: ChatComposerProps) {
    const { t } = useTranslation();
    const canSend = value.trim().length > 0 && !disabled && !loading;

    const submit = () => {
        if (!canSend) {
            return;
        }

        onSend();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            submit();
        }
    };

    return (
        <form
            className={cx(styles.composer, className)}
            onSubmit={(event) => {
                event.preventDefault();
                submit();
            }}
        >
            {onEmoji ? (
                <IconButton label={t('Insert emoji')} variant="ghost" size="sm" onClick={onEmoji} disabled={disabled}>
                    <Smile aria-hidden="true" />
                </IconButton>
            ) : null}

            <div className={styles.composerField}>
                <Textarea
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder ?? t('Type a message...')}
                    rows={1}
                    maxLength={maxLength}
                    autoGrow
                    maxRows={4}
                    surface="glass"
                    disabled={disabled}
                    className={styles.composerInput}
                    aria-label={t('Message content')}
                />
            </div>

            <IconButton label={t('Send message')} variant="primary" size="md" type="submit" disabled={!canSend}>
                <Send aria-hidden="true" />
            </IconButton>
        </form>
    );
}

export type { ChatComposerProps };
export default ChatComposer;
