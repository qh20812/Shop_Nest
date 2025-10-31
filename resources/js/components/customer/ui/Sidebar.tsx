import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Lock,
  MapPin,
  ShoppingBag,
  UserRound,
  User as UserIcon,
} from 'lucide-react';

interface SidebarUser {
  id?: number;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  email?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
}

interface SidebarProps {
  user: SidebarUser | null;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

interface MenuSubItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  isDropdown: boolean;
  href?: string;
  subItems?: MenuSubItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ user, isMobileOpen = false, onClose }) => {
  const { url } = usePage();

  const normalizedUrl = useMemo(() => {
    const [path] = url.split('?');
    if (!path) {
      return '/';
    }
    const trimmed = path.replace(/\/+$/, '');
    return trimmed.length > 0 ? trimmed : '/';
  }, [url]);

  const isPathActive = useCallback(
    (target: string | undefined) => {
      if (!target) {
        return false;
      }
      if (target === '/') {
        return normalizedUrl === '/';
      }
      return normalizedUrl === target || normalizedUrl.startsWith(`${target}/`);
    },
    [normalizedUrl],
  );

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        key: 'account',
        label: 'Tài khoản của tôi',
        icon: <UserIcon className="sidebar-item-icon" aria-hidden="true" />, // matches account actions
        isDropdown: true,
        subItems: [
          { label: 'Hồ sơ', href: '/user/profile', icon: <UserRound className="sidebar-subitem-icon" aria-hidden="true" /> },
          { label: 'Địa chỉ', href: '/user/addresses', icon: <MapPin className="sidebar-subitem-icon" aria-hidden="true" /> },
          { label: 'Đổi mật khẩu', href: '/user/change-password', icon: <Lock className="sidebar-subitem-icon" aria-hidden="true" /> },
          { label: 'Thông tin cá nhân', href: '/user/personal-info', icon: <FileText className="sidebar-subitem-icon" aria-hidden="true" /> },
        ],
      },
      {
        key: 'orders',
        label: 'Đơn mua',
        icon: <ShoppingBag className="sidebar-item-icon" aria-hidden="true" />, // direct navigation item
        isDropdown: false,
        href: '/user/orders',
      },
    ],
    [],
  );

  const [openSection, setOpenSection] = useState<string | null>(() => {
    const defaultDropdown = menuItems.find(
      (item) => item.isDropdown && item.subItems?.some((subItem) => isPathActive(subItem.href)),
    );
    return defaultDropdown?.key ?? null;
  });

  useEffect(() => {
    const matchedDropdown = menuItems.find(
      (item) => item.isDropdown && item.subItems?.some((subItem) => isPathActive(subItem.href)),
    );
    setOpenSection((current) => {
      if (matchedDropdown) {
        return current === matchedDropdown.key ? current : matchedDropdown.key;
      }
      return current ? null : current;
    });
  }, [isPathActive, menuItems]);

  const handleToggleSection = useCallback((key: string) => {
    setOpenSection((current) => (current === key ? null : key));
  }, []);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const displayName = useMemo(() => {
    if (!user) {
      return null;
    }
    if (user.name && user.name.trim().length > 0) {
      return user.name;
    }
    const first = user.first_name?.trim() ?? '';
    const last = user.last_name?.trim() ?? '';
    const full = `${first} ${last}`.trim();
    if (full.length > 0) {
      return full;
    }
    if (user.username && user.username.trim().length > 0) {
      return user.username;
    }
    return user.email ?? null;
  }, [user]);

  const resolvedAvatar = useMemo(() => {
    if (!user) {
      return '/images/default-avatar.png';
    }
    if (user.avatar_url && user.avatar_url.trim().length > 0) {
      return user.avatar_url;
    }
    if (user.avatar && user.avatar.trim().length > 0) {
      return user.avatar;
    }
    return '/images/default-avatar.png';
  }, [user]);

  return (
    <aside
      className={`customer-sidebar${isMobileOpen ? ' is-open' : ''}`}
      data-open={isMobileOpen}
      aria-hidden={isMobileOpen ? false : undefined}
    >
      <div className="sidebar-header">
        <div className="sidebar-avatar-wrapper">
          <img
            src={resolvedAvatar}
            alt={displayName ? `Avatar của ${displayName}` : 'Avatar người dùng'}
            className="sidebar-user-avatar"
          />
        </div>
        <div className="sidebar-user-details">
          <span className="sidebar-user-name">{displayName ?? 'Khách hàng'}</span>
          <Link
            href="/user/profile/edit"
            className="sidebar-edit-btn"
            onClick={handleClose}
          >
            Sửa hồ sơ
          </Link>
        </div>
      </div>

      <nav className="sidebar-menu" aria-label="Customer navigation">
        {menuItems.map((item) => {
          const isDropdown = item.isDropdown && item.subItems && item.subItems.length > 0;
          const dropdownActive = isDropdown
            ? item.subItems!.some((subItem) => isPathActive(subItem.href))
            : false;
          const isActive = isDropdown ? dropdownActive : isPathActive(item.href);
          const isOpen = isDropdown ? openSection === item.key : false;

          return (
            <div className="sidebar-section" key={item.key}>
              {isDropdown ? (
                <>
                  <button
                    type="button"
                    className={`sidebar-section-trigger${isOpen ? ' is-open' : ''}${dropdownActive ? ' is-active' : ''}`}
                    onClick={() => handleToggleSection(item.key)}
                    aria-expanded={isOpen}
                    aria-controls={`sidebar-section-${item.key}`}
                  >
                    <span className="sidebar-section-leading">
                      {item.icon}
                      <span className="sidebar-section-label">{item.label}</span>
                    </span>
                    {isOpen ? (
                      <ChevronDown className="sidebar-section-chevron" aria-hidden="true" />
                    ) : (
                      <ChevronRight className="sidebar-section-chevron" aria-hidden="true" />
                    )}
                  </button>
                  <div
                    id={`sidebar-section-${item.key}`}
                    className={`sidebar-submenu${isOpen ? ' is-open' : ''}`}
                    role="region"
                    aria-hidden={!isOpen}
                  >
                    {item.subItems!.map((subItem) => {
                      const subActive = isPathActive(subItem.href);
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`sidebar-subitem${subActive ? ' is-active' : ''}`}
                          onClick={handleClose}
                          aria-current={subActive ? 'page' : undefined}
                        >
                          {subItem.icon}
                          <span className="sidebar-subitem-label">{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              ) : (
                <Link
                  href={item.href ?? '#'}
                  className={`sidebar-link${isActive ? ' is-active' : ''}`}
                  onClick={handleClose}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  <span className="sidebar-link-label">{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
