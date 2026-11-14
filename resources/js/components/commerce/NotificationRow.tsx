import { Link } from '@inertiajs/react';
import { Bell, Megaphone, PackageCheck, ShieldAlert, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    promotion: 'bg-lacquer-wash text-lacquer-red',
    order: 'bg-jade-soft text-jade',
    system: 'bg-turmeric-soft text-turmeric',
    delivery: 'bg-jade-soft text-jade',
    general: 'bg-raw-linen text-ink-muted',
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
        <article
            className={cn(
                'flex items-start gap-3 border-t border-border py-4 first:border-t-0 first:pt-0',
                unread && 'rounded-card bg-rice-paper/50 px-3',
                className,
            )}
        >
            <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-pill', categoryTones[category])}>
                <Icon aria-hidden="true" className="size-5" />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={cn('text-body-md', unread ? 'font-semibold text-ink' : 'font-medium text-ink-muted')}>{notification.title}</span>
                    {unread && <span aria-label="Chưa đọc" className="size-2 rounded-pill bg-lacquer-red" />}
                    {notification.type_label && (
                        <span className="font-mono text-label-micro tracking-[0.08em] text-ink-faint uppercase">{notification.type_label}</span>
                    )}
                </div>
                <p className="line-clamp-2 text-body-sm leading-relaxed text-ink-muted">{notification.content}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                    {notification.created_at && <span className="font-mono text-label-micro text-ink-faint">{notification.created_at}</span>}
                    {notification.action_url && (
                        <Button variant="tertiary" size="sm" asChild>
                            <Link href={notification.action_url}>Xem chi tiết</Link>
                        </Button>
                    )}
                    {unread && onRead && (
                        <button
                            type="button"
                            className="focus-ring text-body-sm font-medium text-lacquer-red underline-offset-4 hover:underline"
                            onClick={() => onRead(notification.id)}
                        >
                            Đánh dấu đã đọc
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

export type { NotificationModel, NotificationRowProps };
export default NotificationRow;
