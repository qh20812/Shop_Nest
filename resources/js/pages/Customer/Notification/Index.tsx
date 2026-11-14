import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import * as React from 'react';

import { NotificationRow, type NotificationModel } from '@/components/commerce/NotificationRow';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';

interface PageProps extends Record<string, unknown> {
    notifications?: NotificationModel[];
    filters?: { tab?: string };
}

const tabs = [
    { value: 'all', label: 'Tất cả' },
    { value: 'unread', label: 'Chưa đọc' },
    { value: 'promotion', label: 'Khuyến mãi' },
    { value: 'order', label: 'Đơn hàng' },
];

export default function NotificationIndex() {
    const { notifications = [], filters = {} } = usePage<PageProps>().props;
    const { success, error: showError } = useToast();
    const [items, setItems] = React.useState<NotificationModel[]>(notifications);
    const [markingAll, setMarkingAll] = React.useState(false);
    const activeTab = filters.tab ?? 'all';

    React.useEffect(() => {
        setItems(notifications);
    }, [notifications]);

    const unreadCount = items.filter((item) => !item.is_read).length;

    const changeTab = (tab: string) => {
        router.get('/user/notifications', { tab }, { preserveScroll: true, preserveState: true, replace: true });
    };

    const markAllRead = () => {
        setMarkingAll(true);
        router.post(
            '/user/notifications/mark-all-read',
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setItems((current) => current.map((item) => ({ ...item, is_read: true })));
                    success('Đã đánh dấu tất cả là đã đọc');
                },
                onError: () => showError('Không thể cập nhật thông báo'),
                onFinish: () => setMarkingAll(false),
            },
        );
    };

    const markRead = (id: number) => {
        axios
            .post(`/user/notifications/${id}/read`)
            .then(() => {
                setItems((current) => current.map((item) => (item.id === id ? { ...item, is_read: true } : item)));
            })
            .catch(() => showError('Không thể đánh dấu thông báo'));
    };

    return (
        <AccountLayout
            active="notifications"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Thông báo' }]}
            eyebrow="Tài khoản"
            title="Thông báo"
            description="Cập nhật đơn hàng, khuyến mãi và thông tin hệ thống gửi tới bạn."
            count={unreadCount > 0 ? `${unreadCount} chưa đọc` : `${items.length} thông báo`}
            actions={
                <Button variant="secondary" size="sm" leftIcon={CheckCheck} onClick={markAllRead} loading={markingAll} disabled={unreadCount === 0}>
                    Đánh dấu tất cả đã đọc
                </Button>
            }
        >
            <Head title="Thông báo" />

            <div className="flex flex-col gap-5">
                <Tabs
                    items={tabs.map((tab) => ({ value: tab.value, label: tab.label }))}
                    value={activeTab}
                    onValueChange={changeTab}
                    variant="filter"
                    ariaLabel="Lọc thông báo"
                />

                {items.length === 0 ? (
                    <EmptyState
                        icon={BellOff}
                        title="Không có thông báo nào"
                        description={
                            activeTab === 'all'
                                ? 'Khi có cập nhật về đơn hàng hoặc khuyến mãi, thông báo sẽ xuất hiện tại đây.'
                                : 'Không có thông báo phù hợp với bộ lọc này.'
                        }
                        actions={
                            activeTab === 'all' ? undefined : (
                                <Button variant="secondary" size="sm" onClick={() => changeTab('all')}>
                                    Xem tất cả
                                </Button>
                            )
                        }
                    />
                ) : (
                    <div className="rounded-card border border-border bg-warm-porcelain p-5">
                        {items.map((notification) => (
                            <NotificationRow key={notification.id} notification={notification} onRead={markRead} />
                        ))}
                    </div>
                )}

                <p className="flex items-center gap-2 text-label-micro text-ink-faint">
                    <Bell aria-hidden="true" className="size-3.5" />
                    Thông báo được giữ tối đa 100 bản gần nhất.
                </p>
            </div>
        </AccountLayout>
    );
}
