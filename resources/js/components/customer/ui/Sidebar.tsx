import React, { useMemo, useState } from 'react';
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
  name: string;
  avatar?: string | null;
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
  const [openSection, setOpenSection] = useState<string | null>('account');

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

  const handleToggleSection = (key: string) => {
    setOpenSection((current) => (current === key ? null : key));
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const resolvedAvatar = user?.avatar || '/images/default-avatar.png';

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
            alt={user?.name ? `Avatar của ${user.name}` : 'Avatar người dùng'}
            className="sidebar-user-avatar"
          />
        </div>
        <div className="sidebar-user-details">
          <span className="sidebar-user-name">{user?.name ?? 'Khách hàng'}</span>
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
          const isActive = item.href ? url.startsWith(item.href) : false;
          const isOpen = openSection === item.key;

          return (
            <div className="sidebar-section" key={item.key}>
              {isDropdown ? (
                <>
                  <button
                    type="button"
                    className={`sidebar-section-trigger${isOpen ? ' is-open' : ''}`}
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
                      const subActive = url.startsWith(subItem.href);
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`sidebar-subitem${subActive ? ' is-active' : ''}`}
                          onClick={handleClose}
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
