import React, { useEffect, useRef, useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import CustomerLayout from '@/layouts/app/CustomerLayout'
import '@/../css/customer-style/customer-profile.css'

const editableFields = ['first_name', 'last_name', 'email', 'phone_number', 'gender', 'date_of_birth'] as const
type EditableField = (typeof editableFields)[number]

interface UserProfile {
  id: number
  username: string
  first_name: string | null
  last_name: string | null
  email: string
  phone_number: string | null
  gender: string | null
  date_of_birth: string | null
  avatar: string | null
  avatar_url?: string | null
}

interface FormState {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  gender: string
  date_of_birth: string
}

type ValidationErrors = Partial<Record<EditableField | 'avatar', string>> & Record<string, string>

interface ProfilePageProps extends Record<string, unknown> {
  user: UserProfile
  errors?: ValidationErrors
}

const createFormState = (user: UserProfile): FormState => ({
  first_name: user.first_name ?? '',
  last_name: user.last_name ?? '',
  email: user.email ?? '',
  phone_number: user.phone_number ?? '',
  gender: user.gender ?? '',
  date_of_birth: user.date_of_birth ?? '',
})

export default function Index() {
  const page = usePage<ProfilePageProps>()
  const { user } = page.props
  const validationErrors = (page.props.errors ?? {}) as ValidationErrors

  const initialValuesRef = useRef<FormState>(createFormState(user))
  const [formState, setFormState] = useState<FormState>(() => initialValuesRef.current)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar_url ?? '')
  const [avatarDirty, setAvatarDirty] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const userIdRef = useRef<number>(user.id)
  const inputRefs = useRef<Record<EditableField, HTMLInputElement | HTMLSelectElement | null>>({
    first_name: null,
    last_name: null,
    email: null,
    phone_number: null,
    gender: null,
    date_of_birth: null,
  })
  const avatarUrlRef = useRef<string>(user.avatar_url ?? '')
  const avatarInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const nextInitial = createFormState(user)
    const userChanged =
      userIdRef.current !== user.id ||
      editableFields.some((field) => nextInitial[field] !== initialValuesRef.current[field]) ||
      (avatarUrlRef.current ?? '') !== (user.avatar_url ?? '')

    if (!userChanged) return

    userIdRef.current = user.id
    avatarUrlRef.current = user.avatar_url ?? ''
    initialValuesRef.current = nextInitial
    setFormState(nextInitial)
    setAvatarFile(null)
    setAvatarDirty(false)
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return user.avatar_url ?? ''
    })
  }, [user])

  const handleInputChange = (field: EditableField) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setAvatarFile(file)
    setAvatarDirty(Boolean(file))
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return file ? URL.createObjectURL(file) : user.avatar_url ?? ''
    })
    event.target.value = ''
  }

  useEffect(
    () => () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview)
    },
    [avatarPreview]
  )

  const handleCancel = () => {
    setFormState(initialValuesRef.current)
    setAvatarFile(null)
    setAvatarDirty(false)
    avatarUrlRef.current = user.avatar_url ?? ''
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return user.avatar_url ?? ''
    })
  }

  const isDirty = avatarDirty || editableFields.some((field) => formState[field] !== (initialValuesRef.current[field] ?? ''))
  const resolvedAvatar = avatarPreview || user.avatar_url || ''
  const canSubmit = isDirty && !isSubmitting

  const handleSave = () => {
    if (!canSubmit) return

    const payload = new FormData()
    payload.append('_method', 'PUT')
    editableFields.forEach((field) => payload.append(field, formState[field]))
    if (avatarFile) payload.append('avatar', avatarFile)

    setIsSubmitting(true)

    router.post('/user/profile', payload, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onSuccess: (pageResponse) => {
        const nextProps = pageResponse.props as unknown as ProfilePageProps
        const nextUser = nextProps.user
        userIdRef.current = nextUser.id
        initialValuesRef.current = createFormState(nextUser)
        avatarUrlRef.current = nextUser.avatar_url ?? ''
        setFormState(initialValuesRef.current)
        setAvatarFile(null)
        setAvatarDirty(false)
        setAvatarPreview((prev) => {
          if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev)
          return nextUser.avatar_url ?? ''
        })
      },
      onFinish: () => setIsSubmitting(false),
    })
  }

  return (
    <CustomerLayout>
      <div className="profile-content-card">
        <div className="profile-content-header">
          <h1 className="profile-page-title">Thông tin cá nhân</h1>
          <p className="profile-page-subtitle">Quản lý thông tin hồ sơ của bạn.</p>
        </div>

        <hr className="profile-content-divider" />

        <form className="profile-form-container" onSubmit={(e) => { e.preventDefault(); handleSave() }}>
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              <div
                className="profile-avatar-image"
                style={{ backgroundImage: `url(${resolvedAvatar || '/images/default-avatar.png'})` }}
              />
              <button
                type="button"
                className="profile-avatar-edit-btn"
                onClick={() => avatarInputRef.current?.click()}
                aria-label="Chỉnh sửa ảnh đại diện"
              >
                <span className="profile-avatar-edit-icon">✎</span>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <p className="profile-avatar-hint">JPG, GIF hoặc PNG. 1MB tối đa.</p>
            {validationErrors.avatar && (
              <span className="profile-field-error">{validationErrors.avatar}</span>
            )}
          </div>

          <div className="profile-fields-section">
            <div className="profile-fields-grid">
              <div>
                <label className="profile-field-label" htmlFor="first-name">Họ</label>
                <input
                  ref={(el) => { inputRefs.current.first_name = el }}
                  id="first-name"
                  className={`profile-field-input${validationErrors.first_name ? ' has-error' : ''}`}
                  type="text"
                  value={formState.first_name}
                  onChange={handleInputChange('first_name')}
                />
                {validationErrors.first_name && (
                  <p className="profile-field-error">{validationErrors.first_name}</p>
                )}
              </div>

              <div>
                <label className="profile-field-label" htmlFor="last-name">Tên</label>
                <input
                  ref={(el) => { inputRefs.current.last_name = el }}
                  id="last-name"
                  className={`profile-field-input${validationErrors.last_name ? ' has-error' : ''}`}
                  type="text"
                  value={formState.last_name}
                  onChange={handleInputChange('last_name')}
                />
                {validationErrors.last_name && (
                  <p className="profile-field-error">{validationErrors.last_name}</p>
                )}
              </div>

              <div className="profile-field-col-span">
                <label className="profile-field-label" htmlFor="email">Email</label>
                <input
                  ref={(el) => { inputRefs.current.email = el }}
                  id="email"
                  className={`profile-field-input${validationErrors.email ? ' has-error' : ''}`}
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange('email')}
                />
                {validationErrors.email && (
                  <p className="profile-field-error">{validationErrors.email}</p>
                )}
              </div>

              <div className="profile-field-col-span">
                <label className="profile-field-label" htmlFor="phone">Số điện thoại</label>
                <input
                  ref={(el) => { inputRefs.current.phone_number = el }}
                  id="phone"
                  className={`profile-field-input${validationErrors.phone_number ? ' has-error' : ''}`}
                  type="tel"
                  value={formState.phone_number}
                  onChange={handleInputChange('phone_number')}
                />
                {validationErrors.phone_number && (
                  <p className="profile-field-error">{validationErrors.phone_number}</p>
                )}
              </div>

              <div>
                <label className="profile-field-label" htmlFor="gender">Giới tính</label>
                <select
                  ref={(el) => { inputRefs.current.gender = el }}
                  id="gender"
                  className="profile-field-select"
                  value={formState.gender}
                  onChange={handleInputChange('gender')}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="profile-field-label" htmlFor="birthdate">Ngày sinh</label>
                <input
                  ref={(el) => { inputRefs.current.date_of_birth = el }}
                  id="birthdate"
                  className={`profile-field-input${validationErrors.date_of_birth ? ' has-error' : ''}`}
                  type="date"
                  value={formState.date_of_birth}
                  onChange={handleInputChange('date_of_birth')}
                />
                {validationErrors.date_of_birth && (
                  <p className="profile-field-error">{validationErrors.date_of_birth}</p>
                )}
              </div>

              <div className="profile-field-col-span">
                <button
                  type="button"
                  className="profile-change-password-link"
                  onClick={() => window.location.href = '/user/change-password'}
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>

            <div className="profile-form-actions">
              <button
                type="button"
                className="profile-action-btn profile-btn-cancel"
                onClick={handleCancel}
                disabled={!isDirty || isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="profile-action-btn profile-btn-save"
                disabled={!canSubmit}
              >
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </CustomerLayout>
  )
}
