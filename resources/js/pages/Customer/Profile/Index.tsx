import React, { useEffect, useRef, useState } from 'react'
import { router, usePage } from '@inertiajs/react'
import CustomerLayout from '@/layouts/app/CustomerLayout'

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

type EditingState = Record<EditableField, boolean>

interface FlashBag {
  success?: string
  error?: string
  [key: string]: string | undefined
}

type ValidationErrors = Partial<Record<EditableField | 'avatar', string>> & Record<string, string>

interface ProfilePageProps extends Record<string, unknown> {
  user: UserProfile
  errors?: ValidationErrors
  flash?: FlashBag
}

const createFormState = (user: UserProfile): FormState => ({
  first_name: user.first_name ?? '',
  last_name: user.last_name ?? '',
  email: user.email ?? '',
  phone_number: user.phone_number ?? '',
  gender: user.gender ?? '',
  date_of_birth: user.date_of_birth ?? '',
})

const createEditingState = (value = false): EditingState => {
  const state = {} as EditingState
  editableFields.forEach((field) => {
    state[field] = value
  })
  return state
}

const Index: React.FC = () => {
  const page = usePage<ProfilePageProps>()
  const { user, flash } = page.props
  const validationErrors = (page.props.errors ?? {}) as ValidationErrors

  const initialValuesRef = useRef<FormState>(createFormState(user))
  const [formState, setFormState] = useState<FormState>(() => initialValuesRef.current)
  const [editing, setEditing] = useState<EditingState>(() => createEditingState())
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

    if (!userChanged) {
      return
    }

    userIdRef.current = user.id
    avatarUrlRef.current = user.avatar_url ?? ''
    initialValuesRef.current = nextInitial
    setFormState(nextInitial)
    setEditing(createEditingState())
    setAvatarFile(null)
    setAvatarDirty(false)
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      return user.avatar_url ?? ''
    })
  }, [user])

  const focusField = (field: EditableField) => {
    if (typeof window === 'undefined') {
      return
    }
    window.setTimeout(() => {
      inputRefs.current[field]?.focus()
    }, 60)
  }

  const handleInputChange = (field: EditableField) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleEdit = (field: EditableField) => {
    setEditing((prev) => {
      const next = { ...prev, [field]: !prev[field] }
      if (!prev[field]) {
        focusField(field)
      } else {
        setFormState((state) => ({ ...state, [field]: initialValuesRef.current[field] }))
      }
      return next
    })
  }

  const handleToggleAll = () => {
    const anyEditing = editableFields.some((field) => editing[field])
    if (anyEditing) {
      handleCancel()
      return
    }
    setEditing(createEditingState(true))
    focusField('first_name')
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setAvatarFile(file)
    setAvatarDirty(Boolean(file))
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      if (!file) {
        return user.avatar_url ?? ''
      }
      return URL.createObjectURL(file)
    })
    event.target.value = ''
  }

  useEffect(
    () => () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview)
      }
    },
    [avatarPreview]
  )

  const handleCancel = () => {
    setFormState(initialValuesRef.current)
    setEditing(createEditingState())
    setAvatarFile(null)
    setAvatarDirty(false)
    avatarUrlRef.current = user.avatar_url ?? ''
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev)
      }
      return user.avatar_url ?? ''
    })
  }

  const isDirty =
    avatarDirty || editableFields.some((field) => formState[field] !== (initialValuesRef.current[field] ?? ''))

  const resolvedAvatar = avatarPreview || user.avatar_url || ''
  const canSubmit = isDirty && !isSubmitting

  const handleSave = () => {
    if (!canSubmit) {
      return
    }

    const payload = new FormData()
    payload.append('_method', 'PUT')
    editableFields.forEach((field) => {
      payload.append(field, formState[field])
    })
    if (avatarFile) {
      payload.append('avatar', avatarFile)
    }

    setIsSubmitting(true)

    router.post('/user/profile', payload, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onError: (errors) => {
        setEditing((prev) => {
          const next = { ...prev }
          let mutated = false
          editableFields.forEach((field) => {
            if (errors[field]) {
              next[field] = true
              mutated = true
            }
          })
          return mutated ? next : prev
        })
      },
      onSuccess: (pageResponse) => {
  const nextProps = pageResponse.props as unknown as ProfilePageProps
        const nextUser = nextProps.user
  userIdRef.current = nextUser.id
        initialValuesRef.current = createFormState(nextUser)
        avatarUrlRef.current = nextUser.avatar_url ?? ''
        setFormState(initialValuesRef.current)
        setEditing(createEditingState())
        setAvatarFile(null)
        setAvatarDirty(false)
        setAvatarPreview((prev) => {
          if (prev && prev.startsWith('blob:')) {
            URL.revokeObjectURL(prev)
          }
          return nextUser.avatar_url ?? ''
        })
      },
      onFinish: () => {
        setIsSubmitting(false)
      },
    })
  }

  return (
    <CustomerLayout>
      <section className="orders-page profile-page" aria-labelledby="profile-heading">
        {(flash?.success || flash?.error) && (
          <div
            className={`profile-flash ${flash.success ? 'profile-flash--success' : 'profile-flash--error'}`}
            role="status"
            aria-live="polite"
          >
            {flash.success || flash.error}
          </div>
        )}

        <header className="profile-header">
          <div className="profile-avatar" aria-hidden="true">
            {resolvedAvatar ? (
              <img src={resolvedAvatar} alt="Ảnh đại diện" />
            ) : (
              <div className="profile-avatar-thumb" aria-hidden="true" />
            )}
          </div>
          <div className="profile-header-info">
            <h1 id="profile-heading" className="profile-title">
              Hồ sơ của tôi
            </h1>
            <p className="profile-subtitle">
              Quản lý thông tin cá nhân để đơn hàng và trải nghiệm mua sắm luôn chính xác.
            </p>
            <button
              type="button"
              className="profile-edit-toggle"
              onClick={handleToggleAll}
              aria-pressed={editableFields.some((field) => editing[field])}
            >
              {editableFields.some((field) => editing[field]) ? 'Đóng chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
            </button>
          </div>
        </header>

        <section className="profile-card" aria-labelledby="profile-personal-heading">
          <div className="profile-card-heading">
            <h2 id="profile-personal-heading" className="profile-section-title">
              Thông tin cá nhân
            </h2>
            <span className="profile-section-hint">Click vào từng trường để chỉnh sửa</span>
          </div>

          <div className="profile-form" role="form">
            <div
              className={`profile-field${editing.first_name ? ' is-editing' : ''}`}
              data-state={editing.first_name ? 'edit' : 'view'}
            >
              <label className="profile-field-label" htmlFor="profile-first-name">
                Họ
              </label>
              <div className="profile-field-body">
                <input
                  ref={(element) => {
                    inputRefs.current.first_name = element
                  }}
                  id="profile-first-name"
                  className="profile-field-input"
                  type="text"
                  value={formState.first_name}
                  onChange={handleInputChange('first_name')}
                  readOnly={!editing.first_name}
                  aria-readonly={!editing.first_name}
                  aria-invalid={Boolean(validationErrors.first_name)}
                  aria-describedby={validationErrors.first_name ? 'profile-first-name-error' : undefined}
                />
                <button
                  type="button"
                  className="profile-inline-action"
                  onClick={() => handleEdit('first_name')}
                  aria-pressed={editing.first_name}
                >
                  {editing.first_name ? 'Đóng' : 'Sửa'}
                </button>
              </div>
              {validationErrors.first_name && (
                <span className="profile-field-error" id="profile-first-name-error" role="alert">
                  {validationErrors.first_name}
                </span>
              )}
            </div>

            <div
              className={`profile-field${editing.last_name ? ' is-editing' : ''}`}
              data-state={editing.last_name ? 'edit' : 'view'}
            >
              <label className="profile-field-label" htmlFor="profile-last-name">
                Tên
              </label>
              <div className="profile-field-body">
                <input
                  ref={(element) => {
                    inputRefs.current.last_name = element
                  }}
                  id="profile-last-name"
                  className="profile-field-input"
                  type="text"
                  value={formState.last_name}
                  onChange={handleInputChange('last_name')}
                  readOnly={!editing.last_name}
                  aria-readonly={!editing.last_name}
                  aria-invalid={Boolean(validationErrors.last_name)}
                  aria-describedby={validationErrors.last_name ? 'profile-last-name-error' : undefined}
                />
                <button
                  type="button"
                  className="profile-inline-action"
                  onClick={() => handleEdit('last_name')}
                  aria-pressed={editing.last_name}
                >
                  {editing.last_name ? 'Đóng' : 'Sửa'}
                </button>
              </div>
              {validationErrors.last_name && (
                <span className="profile-field-error" id="profile-last-name-error" role="alert">
                  {validationErrors.last_name}
                </span>
              )}
            </div>

            <div
              className={`profile-field${editing.email ? ' is-editing' : ''}`}
              data-state={editing.email ? 'edit' : 'view'}
            >
              <label className="profile-field-label" htmlFor="profile-email">
                Email
              </label>
              <div className="profile-field-body">
                <input
                  ref={(element) => {
                    inputRefs.current.email = element
                  }}
                  id="profile-email"
                  className="profile-field-input"
                  type="email"
                  value={formState.email}
                  onChange={handleInputChange('email')}
                  readOnly={!editing.email}
                  aria-readonly={!editing.email}
                  aria-invalid={Boolean(validationErrors.email)}
                  aria-describedby={validationErrors.email ? 'profile-email-error' : undefined}
                />
                <button
                  type="button"
                  className="profile-inline-action"
                  onClick={() => handleEdit('email')}
                  aria-pressed={editing.email}
                >
                  {editing.email ? 'Đóng' : 'Sửa'}
                </button>
              </div>
              {validationErrors.email && (
                <span className="profile-field-error" id="profile-email-error" role="alert">
                  {validationErrors.email}
                </span>
              )}
            </div>

            <div
              className={`profile-field${editing.phone_number ? ' is-editing' : ''}`}
              data-state={editing.phone_number ? 'edit' : 'view'}
            >
              <label className="profile-field-label" htmlFor="profile-phone">
                Số điện thoại
              </label>
              <div className="profile-field-body">
                <input
                  ref={(element) => {
                    inputRefs.current.phone_number = element
                  }}
                  id="profile-phone"
                  className="profile-field-input"
                  type="tel"
                  value={formState.phone_number}
                  onChange={handleInputChange('phone_number')}
                  readOnly={!editing.phone_number}
                  aria-readonly={!editing.phone_number}
                  aria-invalid={Boolean(validationErrors.phone_number)}
                  aria-describedby={validationErrors.phone_number ? 'profile-phone-error' : undefined}
                />
                <button
                  type="button"
                  className="profile-inline-action"
                  onClick={() => handleEdit('phone_number')}
                  aria-pressed={editing.phone_number}
                >
                  {editing.phone_number ? 'Đóng' : 'Sửa'}
                </button>
              </div>
              {validationErrors.phone_number && (
                <span className="profile-field-error" id="profile-phone-error" role="alert">
                  {validationErrors.phone_number}
                </span>
              )}
            </div>

            <div
              className={`profile-field${editing.gender ? ' is-editing' : ''}`}
              data-state={editing.gender ? 'edit' : 'view'}
            >
              <label className="profile-field-label" htmlFor="profile-gender">
                Giới tính
              </label>
              <div className="profile-field-body">
                <select
                  ref={(element) => {
                    inputRefs.current.gender = element
                  }}
                  id="profile-gender"
                  className="profile-field-input"
                  value={formState.gender}
                  onChange={handleInputChange('gender')}
                  disabled={!editing.gender}
                  aria-disabled={!editing.gender}
                  aria-invalid={Boolean(validationErrors.gender)}
                  aria-describedby={validationErrors.gender ? 'profile-gender-error' : undefined}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                <button
                  type="button"
                  className="profile-inline-action"
                  onClick={() => handleEdit('gender')}
                  aria-pressed={editing.gender}
                >
                  {editing.gender ? 'Đóng' : 'Sửa'}
                </button>
              </div>
              {validationErrors.gender && (
                <span className="profile-field-error" id="profile-gender-error" role="alert">
                  {validationErrors.gender}
                </span>
              )}
            </div>

            <div
              className={`profile-field${editing.date_of_birth ? ' is-editing' : ''}`}
              data-state={editing.date_of_birth ? 'edit' : 'view'}
            >
              <label className="profile-field-label" htmlFor="profile-dob">
                Ngày sinh
              </label>
              <div className="profile-field-body">
                <input
                  ref={(element) => {
                    inputRefs.current.date_of_birth = element
                  }}
                  id="profile-dob"
                  className="profile-field-input"
                  type="date"
                  value={formState.date_of_birth}
                  onChange={handleInputChange('date_of_birth')}
                  disabled={!editing.date_of_birth}
                  aria-disabled={!editing.date_of_birth}
                  aria-invalid={Boolean(validationErrors.date_of_birth)}
                  aria-describedby={validationErrors.date_of_birth ? 'profile-dob-error' : undefined}
                />
                <button
                  type="button"
                  className="profile-inline-action"
                  onClick={() => handleEdit('date_of_birth')}
                  aria-pressed={editing.date_of_birth}
                >
                  {editing.date_of_birth ? 'Đóng' : 'Sửa'}
                </button>
              </div>
              {validationErrors.date_of_birth && (
                <span className="profile-field-error" id="profile-dob-error" role="alert">
                  {validationErrors.date_of_birth}
                </span>
              )}
            </div>

            <div className="profile-field" data-state="view">
              <label className="profile-field-label" htmlFor="profile-avatar">
                Ảnh đại diện
              </label>
              <div className="profile-field-body profile-field-body--avatar">
                <div className="profile-avatar-thumb" aria-hidden="true">
                  {resolvedAvatar ? <img src={resolvedAvatar} alt="Ảnh đại diện" /> : null}
                </div>
                <input
                  ref={avatarInputRef}
                  id="profile-avatar"
                  className="profile-field-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  aria-invalid={Boolean(validationErrors.avatar)}
                  aria-describedby={validationErrors.avatar ? 'profile-avatar-error' : undefined}
                />
                <button
                  type="button"
                  className="profile-inline-action"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  Tải ảnh mới
                </button>
              </div>
              {validationErrors.avatar && (
                <span className="profile-field-error" id="profile-avatar-error" role="alert">
                  {validationErrors.avatar}
                </span>
              )}
            </div>
          </div>

          <div className="profile-form-actions">
            <button
              type="button"
              className="profile-action-btn profile-action-btn--primary"
              onClick={handleSave}
              disabled={!canSubmit}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            <button
              type="button"
              className="profile-action-btn profile-action-btn--ghost"
              onClick={handleCancel}
              disabled={!isDirty || isSubmitting}
            >
              Hủy
            </button>
          </div>
        </section>

        <section className="profile-card" aria-labelledby="profile-security-heading">
          <div className="profile-card-heading">
            <h2 id="profile-security-heading" className="profile-section-title">
              Bảo mật &amp; đăng nhập
            </h2>
            <span className="profile-section-hint">Kiểm soát thông tin quan trọng của tài khoản</span>
          </div>

          <div className="profile-summary-list">
            <article className="profile-summary-item">
              <div className="profile-summary-text">
                <h3 className="profile-summary-title">Đổi mật khẩu</h3>
                <p className="profile-summary-description">Đặt lại mật khẩu định kỳ để bảo vệ tài khoản.</p>
              </div>
              <button type="button" className="profile-inline-action">Thiết lập</button>
            </article>

            <article className="profile-summary-item">
              <div className="profile-summary-text">
                <h3 className="profile-summary-title">Xác thực hai bước</h3>
                <p className="profile-summary-description">Bật xác thực 2FA để tăng mức độ an toàn.</p>
              </div>
              <button type="button" className="profile-inline-action">Kích hoạt</button>
            </article>
          </div>
        </section>
      </section>
    </CustomerLayout>
  )
}

export default Index
