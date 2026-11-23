import { Link } from '@inertiajs/react';
import { Bell, Megaphone, PackageCheck, ShieldAlert, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cx } from '@/lib/cx';

import styles from './commerce.module.css';

type NotificationModel = {
    id: number;
    title: string;
    content: string;
    type?: number | string;
    type_label?: string;
    category?: string;
    is_read: boolean;
    action_url?: string | null;
    created_at?: string;
};

type NotificationRowProps = {
    notification: NotificationModel;
    onRead?: (id: number) => void;
    className?: string;
};

const categoryIcons = {
    promotion: Megaphone,
    order: Truck,
    system: ShieldAlert,
    delivery: PackageCheck,
    general: Bell,
} as const;

const categoryTones = {
    promotion: 'accent',
    order: 'success',
    system: 'warning',
    delivery: 'success',
    general: 'neutral',
} as const;

function resolveCategory(notification: NotificationModel): keyof typeof categoryIcons {
    const category = notification.category?.toLowerCase();
    const typeLabel = notification.type_label?.toLowerCase() ?? '';

    if (category === 'promotion' || typeLabel.includes('khuyến')) {
        return 'promotion';
    }

    if (category === 'order' || typeLabel.includes('đơn')) {
        return 'order';
    }

    if (category === 'system' || typeLabel.includes('hệ thống') || typeLabel.includes('bảo mật')) {
        return 'system';
    }

    if (typeLabel.includes('giao')) {
        return 'delivery';
    }

    return 'general';
}

export function NotificationRow({ notification, onRead, className }: NotificationRowProps) {
    const category = resolveCategory(notification);
    const Icon = categoryIcons[category];
    const unread = !notification.is_read;

    return (
        <article className={cx(styles.notificationRow, className)} data-unread={unread ? 'true' : undefined}>
            <span className={styles.notificationIcon} data-tone={categoryTones[category]}>
                <Icon aria-hidden="true" />
            </span>

            <div className={styles.notificationBody}>
                <div className={styles.notificationHead}>
                    <span className={styles.notificationTitle}>{notification.title}</span>
                    {unread ? <span aria-label="Chưa đọc" className={styles.notificationDot} /> : null}
                    {notification.type_label ? <span className={styles.notificationType}>{notification.type_label}</span> : null}
                </div>
                <p className={styles.notificationText}>{notification.content}</p>
                <div className={styles.notificationFooter}>
                    {notification.created_at ? <span className={styles.notificationTime}>{notification.created_at}</span> : null}
                    {notification.action_url ? (
                        <Button variant="tertiary" size="sm" asChild>
                            <Link href={notification.action_url}>Xem chi tiết</Link>
                        </Button>
                    ) : null}
                    {unread && onRead ? (
                        <button type="button" className={styles.notificationReadButton} onClick={() => onRead(notification.id)}>
                            Đánh dấu đã đọc
                        </button>
                    ) : null}
                </div>
            </div>
        </article>
    );
}

export type { NotificationModel, NotificationRowProps };
export default NotificationRow;
