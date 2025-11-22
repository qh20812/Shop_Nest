import React, { useState, useEffect } from 'react'
import { router, usePage } from '@inertiajs/react'
import CustomerLayout from '@/layouts/app/CustomerLayout'
import { MapPin } from 'lucide-react'
import Create from './Create'
import '@/../css/customer-style/customer-address.css'

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

interface Division {
    id: number
    name: string
    code?: string
}

interface PageProps {
    addresses: Address[]
    [key: string]: unknown
}

export default function Index() {
    const { addresses } = usePage<PageProps>().props
    const [isDeleting, setIsDeleting] = useState<number | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [provinces, setProvinces] = useState<Division[]>([])
    const [createErrors, setCreateErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        fetch('/user/addresses/provinces/1', {
            credentials: 'same-origin'
        }) // Assuming Vietnam country ID is 1
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(() => setProvinces([]))
    }, [])

    const handleSetDefault = (addressId: number) => {
        router.post(`/user/addresses/${addressId}/set-default`, {}, {
            preserveScroll: true,
        })
    }

    const handleDelete = (addressId: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            setIsDeleting(addressId)
            router.delete(`/user/addresses/${addressId}`, {
                preserveScroll: true,
                onFinish: () => setIsDeleting(null),
            })
        }
    }

    const handleAddNew = () => {
        setShowCreateModal(true)
        setCreateErrors({})
    }

    const handleCloseCreateModal = () => {
        setShowCreateModal(false)
        setCreateErrors({})
    }

    const handleCreateSuccess = () => {
        setShowCreateModal(false)
        setCreateErrors({})
        // Reload addresses
        router.reload({ preserveUrl: true })
    }

    const handleEdit = (addressId: number) => {
        router.visit(`/user/addresses/${addressId}/edit`)
    }

    return (
        <>
            <CustomerLayout>
                <div className="address-content-card">
                    <div className="address-header">
                        <div className="address-header-content">
                            <h1 className="address-title">Địa chỉ của tôi</h1>
                            <p className="address-subtitle">Quản lý địa chỉ nhận hàng của bạn.</p>
                        </div>
                        <button
                            type="button"
                            className="address-add-btn"
                            onClick={handleAddNew}
                        >
                            <MapPin className="address-add-icon" style={{ fontVariationSettings: '"FILL" 1' }} />
                            <span>Thêm địa chỉ mới</span>
                        </button>
                    </div>

                    <hr className="address-divider" />

                    <div className="address-list-container">
                        <div className="address-list">
                            {addresses && addresses.length > 0 ? (
                                addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`address-card${address.is_default ? ' is-default' : ''}`}
                                    >
                                        <div className="address-info">
                                            <div className="address-name-row">
                                                <h3 className="address-name">{address.name}</h3>
                                                {address.is_default && (
                                                    <span className="address-default-badge">Mặc định</span>
                                                )}
                                            </div>
                                            <p className="address-phone">{address.phone}</p>
                                            <p className="address-details">
                                                {address.address}, {address.ward}, {address.province}, {address.country}
                                            </p>
                                        </div>

                                        <div className="address-actions">
                                            <div className="address-action-links">
                                                <button
                                                    type="button"
                                                    className="address-action-btn edit"
                                                    onClick={() => handleEdit(address.id)}
                                                >
                                                    Sửa
                                                </button>
                                                <span className="address-action-separator">|</span>
                                                <button
                                                    type="button"
                                                    className="address-action-btn delete"
                                                    onClick={() => handleDelete(address.id)}
                                                    disabled={isDeleting === address.id}
                                                >
                                                    {isDeleting === address.id ? 'Đang xóa...' : 'Xóa'}
                                                </button>
                                            </div>
                                            {!address.is_default && (
                                                <button
                                                    type="button"
                                                    className="address-set-default-btn"
                                                    onClick={() => handleSetDefault(address.id)}
                                                >
                                                    Thiết lập mặc định
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">Bạn chưa có địa chỉ nào.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {showCreateModal && (
                    <Create
                        provinces={provinces}
                        errors={createErrors}
                        onClose={handleCloseCreateModal}
                        onSuccess={handleCreateSuccess}
                        onError={setCreateErrors}
                    />
                )}
            </CustomerLayout>
        </>
    )
}
