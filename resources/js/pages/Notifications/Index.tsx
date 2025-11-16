import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import DataTable from '@/Components/ui/DataTable';
import { useTranslation } from '@/lib/i18n';
import type { Notification } from './types';
import '@/../css/Page.css';
import Header from '@/Components/ui/Header';

interface PageProps extends Record<string, unknown> {
  notifications: {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  unreadCount: number;
  filters: {
    read?: boolean;
    type?: number;
  };
}

const statusClassMap: Record<string, string> = {
  read: 'status completed',
  unread: 'status pending',
};

const getNotificationIcon = (type: number): string => {
  const iconMap: Record<number, string> = {
    // Admin notifications
    1: 'bx bx-error-circle', // ADMIN_SYSTEM_ALERT
    2: 'bx bx-user', // ADMIN_USER_ACTIVITY
    3: 'bx bx-shopping-bag', // ADMIN_ORDER_MANAGEMENT
    4: 'bx bx-package', // ADMIN_PRODUCT_REVIEW

    // Seller notifications
    5: 'bx bx-cart-add', // SELLER_ORDER_UPDATE
    6: 'bx bx-check-circle', // SELLER_PRODUCT_APPROVAL
    7: 'bx bx-money', // SELLER_PAYMENT_RECEIVED
    8: 'bx bx-star', // SELLER_REVIEW_RECEIVED

    // Shipper notifications
    9: 'bx bx-truck', // SHIPPER_ORDER_ASSIGNED
    10: 'bx bx-map', // SHIPPER_DELIVERY_UPDATE
    11: 'bx bx-credit-card', // SHIPPER_PAYMENT_UPDATE

    // Customer notifications
    12: 'bx bx-receipt', // CUSTOMER_ORDER_STATUS
    13: 'bx bx-gift', // CUSTOMER_PROMOTION
    14: 'bx bx-car', // CUSTOMER_DELIVERY_UPDATE
    15: 'bx bx-edit', // CUSTOMER_REVIEW_REMINDER

    // Common notifications
    16: 'bx bx-wrench', // SYSTEM_MAINTENANCE
  17: 'bx bx-shield', // SECURITY_ALERT
  18: 'bx bx-user-x', // ADMIN_USER_MODERATION
  19: 'bx bx-category', // ADMIN_CATALOG_MANAGEMENT
  20: 'bx bx-store-alt', // SELLER_ACCOUNT_STATUS
  };

  return iconMap[type] || 'bx bx-bell';
};

const getNotificationColor = (type: number): string => {
  const colorMap: Record<number, string> = {
    // Admin notifications - danger/warning colors
    1: 'bg-danger', // ADMIN_SYSTEM_ALERT
    2: 'bg-warning', // ADMIN_USER_ACTIVITY
    3: 'bg-info', // ADMIN_ORDER_MANAGEMENT
    4: 'bg-secondary', // ADMIN_PRODUCT_REVIEW

    // Seller notifications - success colors
    5: 'bg-success', // SELLER_ORDER_UPDATE
    6: 'bg-success', // SELLER_PRODUCT_APPROVAL
    7: 'bg-success', // SELLER_PAYMENT_RECEIVED
    8: 'bg-primary', // SELLER_REVIEW_RECEIVED

    // Shipper notifications - info colors
    9: 'bg-info', // SHIPPER_ORDER_ASSIGNED
    10: 'bg-info', // SHIPPER_DELIVERY_UPDATE
    11: 'bg-primary', // SHIPPER_PAYMENT_UPDATE

    // Customer notifications - various colors
    12: 'bg-primary', // CUSTOMER_ORDER_STATUS
    13: 'bg-warning', // CUSTOMER_PROMOTION
    14: 'bg-info', // CUSTOMER_DELIVERY_UPDATE
    15: 'bg-secondary', // CUSTOMER_REVIEW_REMINDER

    // Common notifications
    16: 'bg-warning', // SYSTEM_MAINTENANCE
    17: 'bg-danger', // SECURITY_ALERT
    18: 'bg-danger', // ADMIN_USER_MODERATION
    19: 'bg-info', // ADMIN_CATALOG_MANAGEMENT
    20: 'bg-secondary', // SELLER_ACCOUNT_STATUS
  };

  return colorMap[type] || 'bg-primary';
};

export default function Index() {
  const { t } = useTranslation();
  const { notifications } = usePage<PageProps>().props;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentNotificationIds = useMemo(() => notifications.data.map((n) => n.notification_id), [notifications.data]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => currentNotificationIds.includes(id)));
  }, [currentNotificationIds]);

  const toggleSelection = useCallback((id: number, isSelected: boolean) => {
    setSelectedIds((prev) => {
      if (isSelected) {
        return prev.includes(id) ? prev : [...prev, id];
      }
      return prev.filter((selectedId) => selectedId !== id);
    });
  }, []);

  const clearSelection = () => setSelectedIds([]);

  const handleMarkAsRead = useCallback(async (notification: Notification) => {
    if (notification.is_read) return;

    try {
      await fetch(`/api/notifications/${notification.notification_id}/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      // Reload page to update data
      router.reload();
    } catch (error) {
      console.error('Failed to mark as read:', error);
      alert(t('Failed to mark notification as read'));
    }
  }, [t]);

  const handleMarkMultipleAsRead = async () => {
    if (!selectedIds.length) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/notifications/mark-multiple-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ notification_ids: selectedIds }),
      });

      if (response.ok) {
        clearSelection();
        router.reload();
      } else {
        throw new Error('Failed to mark notifications as read');
      }
    } catch (error) {
      console.error('Failed to mark multiple as read:', error);
      alert(t('Failed to mark notifications as read'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        clearSelection();
        router.reload();
      } else {
        throw new Error('Failed to mark all as read');
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      alert(t('Failed to mark all notifications as read'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = useCallback(async (notification: Notification) => {
    if (!confirm(t('Are you sure you want to delete this notification?'))) return;

    try {
      const response = await fetch(`/api/notifications/${notification.notification_id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (response.ok) {
        router.reload();
      } else {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
      alert(t('Failed to delete notification'));
    }
  }, [t]);

  const handleDeleteMultiple = async () => {
    if (!selectedIds.length) return;
    if (!confirm(t(`Are you sure you want to delete ${selectedIds.length} notifications?`))) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/notifications/delete-multiple', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ notification_ids: selectedIds }),
      });

      if (response.ok) {
        clearSelection();
        router.reload();
      } else {
        throw new Error('Failed to delete notifications');
      }
    } catch (error) {
      console.error('Failed to delete notifications:', error);
      alert(t('Failed to delete notifications'));
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = useMemo(() => [
    {
      header: '',
      cell: (notification: Notification) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(notification.notification_id)}
          onChange={(event) => toggleSelection(notification.notification_id, event.target.checked)}
          aria-label={`${t('Select notification')} ${notification.title}`}
        />
      ),
    },
    {
      header: 'Type',
      cell: (notification: Notification) => (
        <span
          className={`badge ${getNotificationColor(notification.type)}`}
          title={notification.type_description}
          style={{ cursor: 'help' }}
        >
          <i className={getNotificationIcon(notification.type)} style={{ marginRight: '4px' }}></i>
          {notification.type_label}
        </span>
      ),
    },
    {
      header: 'Title',
      cell: (notification: Notification) => (
        <div>
          <strong>{notification.title}</strong>
          <div className="text-muted small">{notification.content.substring(0, 100)}...</div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (notification: Notification) => (
        <span className={statusClassMap[notification.is_read ? 'read' : 'unread']}>
          {notification.is_read ? t('Read') : t('Unread')}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: (notification: Notification) => (
        <span>{new Date(notification.created_at).toLocaleDateString()}</span>
      ),
    },
    {
      header: 'Actions',
      cell: (notification: Notification) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {!notification.is_read && (
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleMarkAsRead(notification)}
              title={t('Mark as read')}
            >
              <i className="bx bx-check"></i>
            </button>
          )}
          {notification.action_url && (
            <Link
              href={notification.action_url}
              className="btn btn-sm btn-outline-secondary"
              title={t('View details')}
            >
              <i className="bx bx-link-external"></i>
            </Link>
          )}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(notification)}
            title={t('Delete')}
          >
            <i className="bx bx-trash"></i>
          </button>
        </div>
      ),
    },
  ], [selectedIds, toggleSelection, t, handleMarkAsRead, handleDelete]);

  return (
    <AppLayout>
      <Head title={t('Notifications')} />

      <Header 
        title='Trung tâm thông báo' 
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Notifications', active: true }
        ]} 
        reportButton={{
          label: 'Mark all as read',
          icon: 'bx-check-circle',
          onClick: handleMarkAllAsRead
        }}
      />

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {selectedIds.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <label className="form-check-label" style={{ margin: 0 }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={currentNotificationIds.length > 0 && currentNotificationIds.every((id) => selectedIds.includes(id))}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedIds((prev) => [...new Set([...prev, ...currentNotificationIds])]);
                      } else {
                        setSelectedIds((prev) => prev.filter((id) => !currentNotificationIds.includes(id)));
                      }
                    }}
                    aria-label={t('Select all notifications on this page')}
                  />
                  {t('Select all on this page')} ({currentNotificationIds.length})
                </label>
              </div>

              <button
                className="btn btn-success"
                onClick={handleMarkMultipleAsRead}
                disabled={isProcessing}
              >
                <i className="bx bx-check"></i>
                {t('Mark selected as read')} ({selectedIds.length})
              </button>

              <button
                className="btn btn-danger"
                onClick={handleDeleteMultiple}
                disabled={isProcessing}
              >
                <i className="bx bx-trash"></i>
                {t('Delete selected')} ({selectedIds.length})
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={clearSelection}
              >
                {t('Clear selection')}
              </button>
            </>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={notifications.data}
        headerTitle="Notifications"
        headerIcon="bx-bell"
        emptyMessage="No notifications found"
      />

      {/* Pagination would go here */}
    </AppLayout>
  );
}
