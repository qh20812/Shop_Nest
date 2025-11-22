import React, { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'
import CustomerLayout from '@/layouts/app/CustomerLayout'
import '@/../css/customer-style/customer-order.css'

interface OrderItem {
  id: number
  product_name: string
  product_image?: string | null
  quantity: number
  price: number
}

interface Order {
  id: number
  code: string
  status: string
  payment_status: string
  total: number
  created_at: string
  can_cancel?: boolean
}

interface PageProps {
  orders: Order[]
  filters?: { search?: string; status?: string }
  [key: string]: unknown
}

export default function Index() {
  const { orders = [], filters = {} } = usePage<PageProps>().props
  const [search, setSearch] = useState(filters.search || '')
  const [status, setStatus] = useState(filters.status || 'all')
  const [showModal, setShowModal] = useState(false)
  interface DetailOrder extends Order {
    items?: OrderItem[]
    subtotal?: number
    shipping_fee?: number
    discount_total?: number
  }
  const [modalOrder, setModalOrder] = useState<DetailOrder | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const statuses: { key: string; label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Chờ xử lý' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'shipped', label: 'Đã giao cho hãng' },
    { key: 'delivered', label: 'Đã giao' },
    { key: 'canceled', label: 'Đã hủy' }
  ]

  const applyFilters = () => {
    router.get('/user/orders', { search, status }, { preserveState: true, preserveScroll: true })
  }

  useEffect(() => {
    const h = setTimeout(() => {
      applyFilters()
    }, 500)
    return () => clearTimeout(h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const handleStatusClick = (s: string) => {
    setStatus(s)
    router.get('/user/orders', { search, status: s }, { preserveState: true, preserveScroll: true })
  }

  const formatCurrency = (v: number) => v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

  const openOrder = (orderId: number) => {
    setShowModal(true)
    setIsLoadingDetail(true)
    setModalOrder(null)
    fetch(`/user/orders/${orderId}`, { headers: { 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' })
      .then(res => res.json())
      .then(data => {
        const page = (data.props || data)
        setModalOrder(page.order)
      })
      .catch(() => setModalOrder(null))
      .finally(() => setIsLoadingDetail(false))
  }

  const closeModal = () => {
    setShowModal(false)
    setModalOrder(null)
  }

  const statusBadgeClass = (s: string) => `order-status-badge status-${s}`

  return (
    <CustomerLayout>
      <div className="orders-content-card">
        <div className="orders-header">
          <div className="orders-header-content">
            <h1 className="orders-title">Đơn hàng của tôi</h1>
            <p className="orders-subtitle">Xem và theo dõi tất cả các đơn hàng bạn đã đặt.</p>
          </div>
        </div>
        <hr className="orders-divider" />

        <div className="orders-filters">
          <div className="orders-status-tabs">
            {statuses.map(s => (
              <button
                key={s.key}
                type="button"
                className={`orders-status-tab${status === s.key ? ' active' : ''}`}
                onClick={() => handleStatusClick(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="orders-search-wrapper">
            <input
              type="text"
              className="orders-search-input"
              placeholder="Tìm kiếm mã đơn hàng..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thanh toán</th>
                <th>Tổng tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="orders-empty">Không có đơn hàng.</td>
                </tr>
              )}
              {orders.map(o => (
                <tr key={o.id} className="orders-row">
                  <td>{o.code}</td>
                  <td>{o.created_at}</td>
                  <td><span className={statusBadgeClass(o.status)}>{o.status}</span></td>
                  <td>{o.payment_status}</td>
                  <td>{formatCurrency(o.total)}</td>
                  <td>
                    <button className="orders-action-btn" onClick={() => openOrder(o.id)}>Xem</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="order-modal-overlay" role="dialog" aria-modal="true">
          <div className="order-modal-container">
            <div className="order-modal-header">
              <h2 className="order-modal-title">Chi tiết Đơn hàng</h2>
              <button type="button" className="order-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="order-modal-body">
              {isLoadingDetail && <p className="order-loading">Đang tải...</p>}
              {!isLoadingDetail && modalOrder && (
                <div className="order-detail-wrapper">
                  <div className="order-detail-grid">
                    <div>
                      <p className="order-detail-label">Mã đơn:</p>
                      <p className="order-detail-value">{modalOrder.code}</p>
                    </div>
                    <div>
                      <p className="order-detail-label">Trạng thái:</p>
                      <p className="order-detail-value"><span className={statusBadgeClass(modalOrder.status)}>{modalOrder.status}</span></p>
                    </div>
                    <div>
                      <p className="order-detail-label">Thanh toán:</p>
                      <p className="order-detail-value">{modalOrder.payment_status}</p>
                    </div>
                  </div>
                  <div className="order-items-section">
                    <h3 className="order-section-title">Sản phẩm</h3>
                    <ul className="order-items-list">
                      {modalOrder.items?.map((it: OrderItem) => (
                        <li key={it.id} className="order-item-row">
                          {it.product_image && (
                            <img src={it.product_image} alt={it.product_name} className="order-item-image" />
                          )}
                          <div className="order-item-info">
                            <p className="order-item-name">{it.product_name}</p>
                            <p className="order-item-meta">Số lượng: {it.quantity} × {formatCurrency(it.price)}</p>
                          </div>
                        </li>
                      ))}
                      {(!modalOrder.items || modalOrder.items.length === 0) && <li>Không có sản phẩm.</li>}
                    </ul>
                  </div>
                  <div className="order-totals">
                    <div className="order-total-row">
                      <span>Tổng tiền hàng</span>
                      <span>{formatCurrency(modalOrder.subtotal || modalOrder.total)}</span>
                    </div>
                    {modalOrder.shipping_fee != null && (
                      <div className="order-total-row">
                        <span>Phí vận chuyển</span>
                        <span>{formatCurrency(modalOrder.shipping_fee)}</span>
                      </div>
                    )}
                    {modalOrder.discount_total != null && modalOrder.discount_total > 0 && (
                      <div className="order-total-row">
                        <span>Giảm giá</span>
                        <span>-{formatCurrency(modalOrder.discount_total)}</span>
                      </div>
                    )}
                    <div className="order-total-row order-grand">
                      <span>Thành tiền</span>
                      <span>{formatCurrency(modalOrder.total)}</span>
                    </div>
                  </div>
                  <div className="order-modal-actions">
                    {modalOrder.can_cancel && (
                      <button type="button" className="order-btn-danger">Hủy đơn hàng</button>
                    )}
                    <button type="button" className="order-btn-primary">Liên hệ người bán</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  )
}
