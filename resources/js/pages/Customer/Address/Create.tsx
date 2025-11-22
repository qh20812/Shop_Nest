import React, { useState, useEffect, FormEvent } from 'react'
import { router, usePage } from '@inertiajs/react'
import { Save } from 'lucide-react'
import '@/../css/customer-style/customer-address-create.css'

interface Division {
  id: number
  name: string
  code?: string
}

interface PageProps {
  provinces?: Division[]
  countries?: Division[]
  errors?: Record<string, string>
  onClose?: () => void
  onSuccess?: () => void
  onError?: (errors: Record<string, string>) => void
  [key: string]: unknown
}

export default function Create({ provinces: propProvinces, countries: propCountries, errors: propErrors, onClose, onSuccess, onError }: PageProps = {}) {
  const { provinces: pageProvinces, countries: pageCountries, errors: pageErrors } = usePage<PageProps>().props
  
  const provinces = propProvinces || pageProvinces || []
  const initialCountries = propCountries || pageCountries || []
  const errors = propErrors || pageErrors || {}
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    province_id: '',
    ward_id: '',
    country: 'Việt Nam',
    is_default: false,
  })

  const [countries, setCountries] = useState<Division[]>(initialCountries)
  const [wards, setWards] = useState<Division[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch countries (if not provided) and then provinces for default country (Vietnam if exists)
  useEffect(() => {
    if (initialCountries.length === 0) {
      fetch('/user/addresses/countries', { credentials: 'same-origin' })
        .then(res => res.json())
        .then(data => {
          setCountries(data)
          // Auto-select Vietnam if present
          const vn = data.find((c: Division) => c.code === 'VN' || c.name.includes('Việt'))
          if (vn) {
            setFormData(prev => ({ ...prev, country: vn.name }))
            // Load provinces
            fetch(`/user/addresses/provinces/${vn.id}`, { credentials: 'same-origin' })
              .then(res => res.json())
              .then(() => {
                // Provinces loaded via separate Inertia props on create route; modal case already has them.
              })
              .catch(() => {/* ignore */})
          }
        })
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
          setFormData(prev => ({ ...prev, ward_id: '' }))
        })
        .catch(() => setWards([]))
    } else {
      setWards([])
    }
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

    router.post('/user/addresses', formData, {
      preserveScroll: true,
      onFinish: () => setIsSubmitting(false),
      onSuccess: () => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.visit('/user/addresses')
        }
      },
      onError: (errors) => {
        if (onError) {
          onError(errors)
        }
      }
    })
  }

  const handleCancel = () => {
    if (onClose) {
      onClose()
    } else {
      router.visit('/user/addresses')
    }
  }

  const isFormValid = formData.name && formData.phone && formData.address && 
                      formData.province_id && formData.ward_id

  return (
    <div className="address-create-container">
      <div className="address-create-wrapper">
        <div className="address-create-content">
          <div className="address-create-header">
            <div className="address-create-header-wrapper">
              <div>
                <h1 className="address-create-title">Thêm địa chỉ mới</h1>
                <p className="address-create-subtitle">Vui lòng điền thông tin địa chễ giao hàng của bạn.</p>
              </div>
            </div>
          </div>

          <hr className="address-create-divider" />

          <div className="address-create-body">
            <form className="address-create-form" onSubmit={handleSubmit}>
              <div className="address-create-grid">
                <div className="address-create-field">
                  <label htmlFor="name" className="address-create-label">Tên người nhận</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`address-create-input${errors?.name ? ' error' : ''}`}
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors?.name && <span className="address-create-error">{errors.name}</span>}
                </div>

                <div className="address-create-field">
                  <label htmlFor="phone" className="address-create-label">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`address-create-input${errors?.phone ? ' error' : ''}`}
                    placeholder="0987654321"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors?.phone && <span className="address-create-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="address-create-field">
                <label htmlFor="address" className="address-create-label">Địa chỉ đường</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={`address-create-input${errors?.address ? ' error' : ''}`}
                  placeholder="123 Đường ABC,..."
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                {errors?.address && <span className="address-create-error">{errors.address}</span>}
              </div>

              <div className="address-create-grid">
                <div className="address-create-field">
                  <label htmlFor="province_id" className="address-create-label">Tỉnh/Thành phố</label>
                  <select
                    id="province_id"
                    name="province_id"
                    className={`address-create-select${errors?.province_id ? ' error' : ''}`}
                    value={formData.province_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces?.map(province => (
                      <option key={province.id} value={province.id}>{province.name}</option>
                    ))}
                  </select>
                  {errors?.province_id && <span className="address-create-error">{errors.province_id}</span>}
                </div>

                <div className="address-create-field">
                  <label htmlFor="ward_id" className="address-create-label">Xã/Phường</label>
                  <select
                    id="ward_id"
                    name="ward_id"
                    className={`address-create-select${errors?.ward_id ? ' error' : ''}`}
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
                  {errors?.ward_id && <span className="address-create-error">{errors.ward_id}</span>}
                </div>
              </div>

              <div className="address-create-grid">
                <div className="address-create-field">
                  <label htmlFor="country" className="address-create-label">Quốc gia</label>
                  <select
                    id="country"
                    name="country"
                    className="address-create-select"
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

              <div className="address-create-field">
                <div className="address-create-checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    className="address-create-checkbox"
                    checked={formData.is_default}
                    onChange={handleChange}
                  />
                  <label htmlFor="is_default" className="address-create-checkbox-label">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>
              </div>

              <div className="address-create-actions">
                <button
                  type="button"
                  className="address-create-btn address-create-btn-cancel"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="address-create-btn address-create-btn-submit"
                  disabled={!isFormValid || isSubmitting}
                >
                  <Save className="address-create-btn-icon" size={20} style={{ fontVariationSettings: '"FILL" 1' }} />
                  <span>{isSubmitting ? 'Đang lưu...' : 'Lưu địa chỉ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
