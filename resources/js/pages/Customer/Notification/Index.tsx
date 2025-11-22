import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import CustomerLayout from '@/layouts/app/CustomerLayout'
import '@/../css/customer-style/customer-notification.css'

interface NotificationItem {
  id: number
  title: string
  content: string
  type: number
  type_label: string
  category: string
  icon: string
  color: string
  is_read: boolean
  action_url?: string | null
  created_at: string
}

interface PageProps {
  notifications: NotificationItem[]
  filters: { tab: string }
  [key: string]: unknown
}

const tabs: { key: string; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'unread', label: 'Chưa đọc' },
  { key: 'promotion', label: 'Khuyến mãi' },
  { key: 'order', label: 'Đơn hàng' }
]

export default function Index() {
  const { notifications = [], filters } = usePage<PageProps>().props
  const [activeTab, setActiveTab] = useState(filters.tab || 'all')

  const changeTab = (tab: string) => {
    setActiveTab(tab)
    router.get('/user/notifications', { tab }, { preserveScroll: true, preserveState: true })
  }

  const markAllRead = () => {
    router.post('/user/notifications/mark-all-read', {}, { preserveScroll: true })
  }

  const markRead = (id: number) => {
    router.post(`/user/notifications/${id}/read`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        const idx = notifications.findIndex(n => n.id === id)
        if (idx !== -1) notifications[idx].is_read = true
      }
    })
  }

  const itemColorClass = (color: string) => `color-${color}`
  const unreadClass = (unread: boolean) => unread ? 'is-unread' : 'is-read'

  return (
    <CustomerLayout>
      
        <div className="notification-card">
          <div className="notification-header">
            <div className="notification-header-left">
              <h1 className="notification-title">Thông báo</h1>
              <p className="notification-subtitle">Tất cả thông báo từ ShopNest sẽ được hiển thị tại đây.</p>
            </div>
            <button type="button" onClick={markAllRead} className="notification-mark-all-btn">
              <span className="material-symbols-outlined notification-mark-all-icon">mark_chat_read</span>
              <span>Đánh dấu tất cả đã đọc</span>
            </button>
          </div>
          <div className="notification-tabs">
            {tabs.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => changeTab(t.key)}
                className={`notification-tab ${activeTab === t.key ? 'active' : ''}`}
              >{t.label}</button>
            ))}
          </div>
          <div className="notification-list">
            {notifications.length === 0 && (
              <div className="notification-empty">Không có thông báo.</div>
            )}
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`notification-item ${itemColorClass(n.color)} ${unreadClass(!n.is_read)}`}
              >
                <div className={`notification-icon-wrapper ${unreadClass(!n.is_read)} ${itemColorClass(n.color)}`}>
                  <span className="material-symbols-outlined notification-icon">{n.icon}</span>
                </div>
                <div className="notification-content">
                  <div className="notification-content-row">
                    <div className="notification-text-block">
                      <h3 className="notification-item-title">{n.title}</h3>
                      <p className="notification-item-text clamp-2">{n.content}</p>
                      <div className="notification-meta-row">
                        <span className="notification-timestamp">{n.created_at}</span>
                        {!n.is_read && <span className="notification-new-pill">Mới</span>}
                      </div>
                    </div>
                    {n.action_url && (
                      <a href={n.action_url} className="notification-action-link">
                        Xem chi tiết
                        <span className="material-symbols-outlined action-arrow">arrow_forward</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      
    </CustomerLayout>
  )
}
