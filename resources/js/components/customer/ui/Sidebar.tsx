import React, { useMemo } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Lock, MapPin, ShoppingBag, UserRound, Bell } from 'lucide-react'

interface SidebarUser {
  id?: number
  name?: string | null
  first_name?: string | null
  last_name?: string | null
  username?: string | null
  email?: string | null
  avatar?: string | null
  avatar_url?: string | null
}

interface SidebarProps {
  user: SidebarUser | null
  isMobileOpen?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ user, isMobileOpen = false, onClose }) => {
  const { url } = usePage()

  const normalizedUrl = useMemo(() => {
    const [path] = url.split('?')
    if (!path) return '/'
    const trimmed = path.replace(/\/+$/, '')
    return trimmed.length > 0 ? trimmed : '/'
  }, [url])

  const isPathActive = (target: string | undefined) => {
    if (!target) return false
    if (target === '/') return normalizedUrl === '/'
    return normalizedUrl === target || normalizedUrl.startsWith(`${target}/`)
  }

  const displayName = useMemo(() => {
    if (!user) return null
    if (user.name && user.name.trim().length > 0) return user.name
    const first = user.first_name?.trim() ?? ''
    const last = user.last_name?.trim() ?? ''
    const full = `${first} ${last}`.trim()
    if (full.length > 0) return full
    if (user.username && user.username.trim().length > 0) return user.username
    return user.email ?? null
  }, [user])

  const resolvedAvatar = useMemo(() => {
    if (!user) return '/images/default-avatar.png'
    if (user.avatar_url && user.avatar_url.trim().length > 0) return user.avatar_url
    if (user.avatar && user.avatar.trim().length > 0) return user.avatar
    return '/images/default-avatar.png'
  }, [user])

  return (
    <nav className={`customer-sidebar${isMobileOpen ? ' is-open' : ''}`}>
      <div className="sidebar-content">
        <div className="sidebar-user-block">
          <div
            className="sidebar-avatar"
            style={{ backgroundImage: `url(${resolvedAvatar})` }}
          />
          <div className="sidebar-user-info">
            <h1 className="sidebar-user-name">{displayName ?? 'Tên người dùng'}</h1>
            {user?.email && <p className="sidebar-user-email">{user.email}</p>}
          </div>
        </div>

        <div className="sidebar-nav-groups">
          <div className="sidebar-nav-group">
            <h2 className="sidebar-group-title">Tài khoản của tôi</h2>
            <ul className="sidebar-nav-list">
              <li>
                <Link
                  href="/user/profile"
                  className={`sidebar-nav-item${isPathActive('/user/profile') ? ' is-active' : ''}`}
                  onClick={onClose}
                >
                  <UserRound className="sidebar-nav-icon" />
                  <span className="sidebar-nav-label">Thông tin cá nhân</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/user/addresses"
                  className={`sidebar-nav-item${isPathActive('/user/addresses') ? ' is-active' : ''}`}
                  onClick={onClose}
                >
                  <MapPin className="sidebar-nav-icon" />
                  <span className="sidebar-nav-label">Địa chỉ</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/user/change-password"
                  className={`sidebar-nav-item${isPathActive('/user/change-password') ? ' is-active' : ''}`}
                  onClick={onClose}
                >
                  <Lock className="sidebar-nav-icon" />
                  <span className="sidebar-nav-label">Đổi mật khẩu</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-nav-group">
            <h2 className="sidebar-group-title">Đơn hàng của tôi</h2>
            <ul className="sidebar-nav-list">
              <li>
                <Link
                  href="/user/orders"
                  className={`sidebar-nav-item${isPathActive('/user/orders') ? ' is-active' : ''}`}
                  onClick={onClose}
                >
                  <ShoppingBag className="sidebar-nav-icon" />
                  <span className="sidebar-nav-label">Quản lý đơn hàng</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-nav-group">
            <h2 className="sidebar-group-title">Thông báo</h2>
            <ul className="sidebar-nav-list">
              <li>
                <Link
                  href="/user/notifications"
                  className={`sidebar-nav-item${isPathActive('/user/notifications') ? ' is-active' : ''}`}
                  onClick={onClose}
                >
                  <Bell className="sidebar-nav-icon" />
                  <span className="sidebar-nav-label">Thông báo</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
