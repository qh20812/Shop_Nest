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
import { useTranslation } from '@/lib/i18n';

import styles from '../customer.module.css';

interface PageProps extends Record<string, unknown> {
    notifications?: NotificationModel[];
    filters?: { tab?: string };
}

const tabKeys = [
    { value: 'all', labelKey: 'All' },
    { value: 'unread', labelKey: 'Unread' },
    { value: 'promotion', labelKey: 'Promotions' },
    { value: 'order', labelKey: 'Orders' },
];

export default function NotificationIndex() {
    const { t } = useTranslation();
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
                    success(t('All notifications marked as read'));
                },
                onError: () => showError(t('Could not update notifications')),
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
            .catch(() => showError(t('Could not mark the notification')));
    };

    return (
        <AccountLayout
            active="notifications"
            breadcrumbs={[{ label: t('Market'), href: '/' }, { label: t('Account') }, { label: t('Notifications') }]}
            eyebrow={t('Account')}
            title={t('Notifications')}
            description={t('Order updates, promotions and system notices sent to you.')}
            count={unreadCount > 0 ? t(':count unread', { count: unreadCount }) : t(':count notifications', { count: items.length })}
            actions={
                <Button variant="secondary" size="sm" leftIcon={CheckCheck} onClick={markAllRead} loading={markingAll} disabled={unreadCount === 0}>
                    {t('Mark all as read')}
                </Button>
            }
        >
            <Head title={t('Notifications')} />

            <div className={styles.stack}>
                <Tabs
                    items={tabKeys.map((tab) => ({ value: tab.value, label: t(tab.labelKey) }))}
                    value={activeTab}
                    onValueChange={changeTab}
                    variant="filter"
                    ariaLabel={t('Filter notifications')}
                />

                {items.length === 0 ? (
                    <EmptyState
                        icon={BellOff}
                        title={t('No notifications')}
                        description={
                            activeTab === 'all' ? t('Order updates and promotions will appear here.') : t('No notifications match this filter.')
                        }
                        actions={
                            activeTab === 'all' ? undefined : (
                                <Button variant="secondary" size="sm" onClick={() => changeTab('all')}>
                                    {t('View all')}
                                </Button>
                            )
                        }
                    />
                ) : (
                    <div className={styles.notificationCard}>
                        {items.map((notification) => (
                            <NotificationRow key={notification.id} notification={notification} onRead={markRead} />
                        ))}
                    </div>
                )}

                <p className={styles.fineprint}>
                    <Bell aria-hidden="true" className={styles.fineprintIcon} />
                    {t('Only the 100 most recent notifications are kept.')}
                </p>
            </div>
        </AccountLayout>
    );
}
