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

const defaultHints = ['Đơn của tôi đang ở đâu?', 'Tôi muốn đổi địa chỉ giao hàng', 'Khi nào đơn được hoàn tiền?'];

export function OrderContextRail({ order, hints = defaultHints, onAsk, className }: OrderContextRailProps) {
    return (
        <aside aria-label="Ngữ cảnh đơn hàng" className={cx(styles.contextRail, className)}>
            <div className={styles.contextRailHead}>
                <MessageCircleQuestion aria-hidden="true" className={styles.contextRailIcon} />
                <h3 className={styles.contextRailTitle}>Đơn hàng đang trao đổi</h3>
            </div>

            <OrderAnnouncementCard order={order} />

            {hints.length > 0 ? (
                <div className={styles.contextHints}>
                    <span className={styles.contextHintsLabel}>Câu hỏi nhanh</span>
                    {hints.map((hint) => (
                        <Button key={hint} variant="secondary" size="sm" className={styles.contextHintButton} onClick={() => onAsk?.(hint)}>
                            {hint}
                        </Button>
                    ))}
                </div>
            ) : null}

            <p className={styles.contextRailNote}>Ngữ cảnh đơn hàng giúp shop trả lời nhanh hơn. Không chia sẻ thông tin thanh toán trong chat.</p>
        </aside>
    );
}

export type { OrderContextRailProps };
export default OrderContextRail;
