import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import { X, Edit, Trash2, CheckCircle } from 'lucide-react'
import '@/../css/customer-style/customer-address-show.css'

interface Address {
  id: number
  name: string
  phone: string
  address: string
  ward: string
  province: string
  country: string
  is_default: boolean
}

interface PageProps {
  address: Address
  [key: string]: unknown
}

export default function Show() {
  const { address } = usePage<PageProps>().props
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClose = () => {
    router.visit('/user/addresses')
  }

  const handleEdit = () => {
    router.visit(`/user/addresses/${address.id}/edit`)
  }

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      setIsDeleting(true)
      router.delete(`/user/addresses/${address.id}`, {
        preserveScroll: true,
        onFinish: () => setIsDeleting(false),
        onSuccess: () => {
          router.visit('/user/addresses')
        }
      })
    }
  }

  const fullAddress = `${address.address}, ${address.ward}, ${address.province}, ${address.country}`

  return (
    <div className="address-show-overlay">
      <div className="address-show-container">
        <div className="address-show-content">
          <div className="address-show-header">
            <div className="address-show-header-content">
              <h1 className="address-show-title">Chi tiết Địa chỉ</h1>
              <p className="address-show-subtitle">Xem thông tin chi tiết địa chỉ giao hàng của bạn.</p>
            </div>
            <button
              type="button"
              className="address-show-close"
              onClick={handleClose}
            >
              <X size={24} />
            </button>
          </div>

          <hr className="address-show-divider" />

          <div className="address-show-body">
            <div className="address-show-details">
              <div className="address-show-row">
                <dt className="address-show-label">Tên người nhận</dt>
                <dd className="address-show-value">{address.name}</dd>
              </div>

              <div className="address-show-row">
                <dt className="address-show-label">Số điện thoại</dt>
                <dd className="address-show-value">{address.phone}</dd>
              </div>

              <div className="address-show-row">
                <dt className="address-show-label">Địa chỉ</dt>
                <dd className="address-show-value">{fullAddress}</dd>
              </div>

              {address.is_default && (
                <div className="address-show-badge-wrapper">
                  <span className="address-show-badge">
                    <CheckCircle className="address-show-badge-icon" size={18} />
                    Địa chỉ mặc định
                  </span>
                </div>
              )}
            </div>

            <div className="address-show-actions">
              <button
                type="button"
                className="address-show-btn address-show-btn-delete"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="address-show-btn-icon" size={20} style={{ fontVariationSettings: '"FILL" 1' }} />
                <span>{isDeleting ? 'Đang xóa...' : 'Xóa'}</span>
              </button>
              <button
                type="button"
                className="address-show-btn address-show-btn-edit"
                onClick={handleEdit}
              >
                <Edit className="address-show-btn-icon" size={20} style={{ fontVariationSettings: '"FILL" 1' }} />
                <span>Sửa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
