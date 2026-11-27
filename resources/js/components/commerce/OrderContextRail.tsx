import { useTranslation } from '@/lib/i18n';
import { MessageCircleQuestion } from 'lucide-react';

import { OrderAnnouncementCard, type OrderAnnouncementModel } from '@/components/commerce/OrderAnnouncementCard';
import { Button } from '@/components/ui/button';
import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type OrderContextRailProps = {
    order: OrderAnnouncementModel;
    hints?: string[];
    onAsk?: (question: string) => void;
    className?: string;
};

const defaultHintKeys = ['Where is my order?', 'I want to change the shipping address', 'When will my refund arrive?'];

export function OrderContextRail({ order, hints, onAsk, className }: OrderContextRailProps) {
    const { t } = useTranslation();
    const resolvedHints = hints ?? defaultHintKeys.map((key) => t(key));
    return (
        <aside aria-label={t('Order context')} className={cx(styles.contextRail, className)}>
            <div className={styles.contextRailHead}>
                <MessageCircleQuestion aria-hidden="true" className={styles.contextRailIcon} />
                <h3 className={styles.contextRailTitle}>{t('Order in this conversation')}</h3>
            </div>

            <OrderAnnouncementCard order={order} />

            {resolvedHints.length > 0 ? (
                <div className={styles.contextHints}>
                    <span className={styles.contextHintsLabel}>{t('Quick questions')}</span>
                    {resolvedHints.map((hint) => (
                        <Button key={hint} variant="secondary" size="sm" className={styles.contextHintButton} onClick={() => onAsk?.(hint)}>
                            {hint}
                        </Button>
                    ))}
                </div>
            ) : null}

            <p className={styles.contextRailNote}>{t('Order context helps the shop reply faster. Never share payment details in chat.')}</p>
        </aside>
    );
}

export type { OrderContextRailProps };
export default OrderContextRail;
