import React, { useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import CustomerLayout from '@/layouts/app/CustomerLayout'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import '@/../css/customer-style/customer-changepassword.css'

interface PageProps {
  errors?: Record<string, string>
  [key: string]: unknown
}

export default function Index() {
  const { errors: pageErrors } = usePage<PageProps>().props

  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>(pageErrors || {})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (formData.new_password !== formData.confirm_password) {
      setErrors(prev => ({ ...prev, confirm_password: 'Mật khẩu xác nhận không khớp.' }))
      return
    }

    setIsSubmitting(true)
    router.post('/user/change-password', formData, {
      preserveScroll: true,
      onError: (errs) => setErrors(errs as Record<string, string>),
      onFinish: () => setIsSubmitting(false),
      onSuccess: () => {
        setFormData({ current_password: '', new_password: '', confirm_password: '' })
      }
    })
  }

  const handleBack = () => {
    router.visit('/user/settings')
  }

  const isFormValid =
    formData.current_password && formData.new_password && formData.confirm_password

  return (
    <CustomerLayout>
      <div className="changepassword-content-card">
        <div className="changepassword-header">
          <h1 className="changepassword-title">Đổi mật khẩu</h1>
          <p className="changepassword-subtitle">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
          </p>
        </div>

        <hr className="changepassword-divider" />

        <div className="changepassword-body">
          <form className="changepassword-form" onSubmit={handleSubmit}>
            <div className="changepassword-field">
              <label htmlFor="current-password" className="changepassword-label">
                Mật khẩu hiện tại
              </label>
              <div className="changepassword-input-wrapper">
                <input
                  id="current-password"
                  name="current_password"
                  type={showCurrent ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`changepassword-input${errors?.current_password ? ' error' : ''}`}
                  placeholder="Nhập mật khẩu hiện tại"
                  value={formData.current_password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="changepassword-visibility-btn"
                  onClick={() => setShowCurrent(v => !v)}
                  aria-label={showCurrent ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors?.current_password && (
                <span className="changepassword-error">{errors.current_password}</span>
              )}
            </div>

            <div className="changepassword-field">
              <label htmlFor="new-password" className="changepassword-label">
                Mật khẩu mới
              </label>
              <div className="changepassword-input-wrapper">
                <input
                  id="new-password"
                  name="new_password"
                  type={showNew ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`changepassword-input${errors?.new_password ? ' error' : ''}`}
                  placeholder="Nhập mật khẩu mới"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="changepassword-visibility-btn"
                  onClick={() => setShowNew(v => !v)}
                  aria-label={showNew ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors?.new_password && (
                <span className="changepassword-error">{errors.new_password}</span>
              )}
            </div>

            <div className="changepassword-field">
              <label htmlFor="confirm-password" className="changepassword-label">
                Xác nhận mật khẩu mới
              </label>
              <div className="changepassword-input-wrapper">
                <input
                  id="confirm-password"
                  name="confirm_password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`changepassword-input${errors?.confirm_password ? ' error' : ''}`}
                  placeholder="Nhập lại mật khẩu mới"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="changepassword-visibility-btn"
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors?.confirm_password && (
                <span className="changepassword-error">{errors.confirm_password}</span>
              )}
            </div>

            <div className="changepassword-actions">
              <button
                type="button"
                className="changepassword-link"
                onClick={handleBack}
              >
                <ArrowLeft size={18} />
                <span>Quay lại Cài đặt</span>
              </button>

              <button
                type="submit"
                className="changepassword-submit"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CustomerLayout>
  )
}
