import React, { useState, useEffect, FormEvent } from 'react'
import { router, usePage } from '@inertiajs/react'
import { X, Save } from 'lucide-react'
import '@/../css/customer-style/customer-address-edit.css'

interface Address {
  id: number
  name: string
  phone: string
  address: string
  ward_id: number
  province_id: number
  country: string
  is_default: boolean
}

interface Division {
  id: number
  name: string
  code?: string
}

interface PageProps {
  address: Address
  provinces: Division[]
  wards: Division[]
  countries?: Division[]
  errors?: Record<string, string>
  [key: string]: unknown
}

export default function Edit() {
  const { address, provinces, wards: initialWards, countries: initialCountries, errors } = usePage<PageProps>().props
  
  const [formData, setFormData] = useState({
    name: address.name || '',
    phone: address.phone || '',
    address: address.address || '',
    province_id: address.province_id || '',
    ward_id: address.ward_id || '',
    country: address.country || 'Việt Nam',
    is_default: address.is_default || false,
  })

  const [countries, setCountries] = useState<Division[]>(initialCountries || [])
  const [wards, setWards] = useState<Division[]>(initialWards || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch countries if not provided (edit may come with just address data)
  useEffect(() => {
    if (!initialCountries) {
      fetch('/user/addresses/countries', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => setCountries(data))
        .catch(() => setCountries([]))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (formData.province_id) {
      fetch(`/user/addresses/wards/${formData.province_id}`, {
        credentials: 'same-origin'
      })
        .then(res => res.json())
        .then(data => {
          setWards(data)
          if (formData.ward_id && !data.find((w: Division) => w.id === Number(formData.ward_id))) {
            setFormData(prev => ({ ...prev, ward_id: '' }))
          }
        })
        .catch(() => setWards([]))
    } else {
      setWards([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.province_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    router.put(`/user/addresses/${address.id}`, formData, {
      preserveScroll: true,
      onFinish: () => setIsSubmitting(false),
      onSuccess: () => {
        router.visit('/user/addresses')
      }
    })
  }

  const handleClose = () => {
    router.visit('/user/addresses')
  }

  return (
    <div className="address-modal-overlay">
      <div className="address-modal-container">
        <div className="address-modal-content">
          <div className="address-modal-header">
            <div className="address-modal-header-content">
              <h1 className="address-modal-title">Sửa địa chỉ</h1>
              <p className="address-modal-subtitle">Chỉnh sửa thông tin địa chỉ giao hàng của bạn.</p>
            </div>
            <button
              type="button"
              className="address-modal-close"
              onClick={handleClose}
            >
              <X size={24} />
            </button>
          </div>

          <hr className="address-modal-divider" />

          <div className="address-modal-body">
            <form className="address-form" onSubmit={handleSubmit}>
              <div className="address-form-grid">
                <div className="address-form-field">
                  <label htmlFor="name" className="address-form-label">Tên người nhận</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`address-form-input${errors?.name ? ' error' : ''}`}
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors?.name && <span className="address-form-error">{errors.name}</span>}
                </div>

                <div className="address-form-field">
                  <label htmlFor="phone" className="address-form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`address-form-input${errors?.phone ? ' error' : ''}`}
                    placeholder="0987654321"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors?.phone && <span className="address-form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="address-form-field">
                <label htmlFor="address" className="address-form-label">Địa chỉ đường</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={`address-form-input${errors?.address ? ' error' : ''}`}
                  placeholder="123 Đường ABC,..."
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                {errors?.address && <span className="address-form-error">{errors.address}</span>}
              </div>

              <div className="address-form-grid">
                <div className="address-form-field">
                  <label htmlFor="province_id" className="address-form-label">Tỉnh/Thành phố</label>
                  <select
                    id="province_id"
                    name="province_id"
                    className={`address-form-select${errors?.province_id ? ' error' : ''}`}
                    value={formData.province_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces?.map(province => (
                      <option key={province.id} value={province.id}>{province.name}</option>
                    ))}
                  </select>
                  {errors?.province_id && <span className="address-form-error">{errors.province_id}</span>}
                </div>

                <div className="address-form-field">
                  <label htmlFor="ward_id" className="address-form-label">Xã/Phường</label>
                  <select
                    id="ward_id"
                    name="ward_id"
                    className={`address-form-select${errors?.ward_id ? ' error' : ''}`}
                    value={formData.ward_id}
                    onChange={handleChange}
                    required
                    disabled={!formData.province_id}
                  >
                    <option value="">Chọn Xã/Phường</option>
                    {wards?.map(ward => (
                      <option key={ward.id} value={ward.id}>{ward.name}</option>
                    ))}
                  </select>
                  {errors?.ward_id && <span className="address-form-error">{errors.ward_id}</span>}
                </div>
              </div>

              <div className="address-form-grid">
                <div className="address-form-field">
                  <label htmlFor="country" className="address-form-label">Quốc gia</label>
                  <select
                    id="country"
                    name="country"
                    className="address-form-select"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Chọn quốc gia</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="address-form-field">
                <div className="address-form-checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    className="address-form-checkbox"
                    checked={formData.is_default}
                    onChange={handleChange}
                  />
                  <label htmlFor="is_default" className="address-form-checkbox-label">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </div>

              <div className="address-form-actions">
                <button
                  type="button"
                  className="address-form-btn address-form-btn-cancel"
                  onClick={handleClose}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="address-form-btn address-form-btn-submit"
                  disabled={isSubmitting}
                >
                  <Save className="address-form-btn-icon" size={20} style={{ fontVariationSettings: '"FILL" 1' }} />
                  <span>{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
