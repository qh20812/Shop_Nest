import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import '@/../css/Page.css';

interface SidebarItem {
  icon: string;
  label: string;
  href: string;
}

interface SidebarProps {
  items: SidebarItem[];
  isClosed: boolean;
}

export default function Sidebar({ items, isClosed }: SidebarProps) {
  const { url } = usePage();

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className={`sidebar ${isClosed ? 'close' : ''}`}>
      <Link href="/" className="logo">
        <i className='bx bx-code-alt'></i>
        <div className="logo-name">
          <span>Shop</span>Nest
        </div>
      </Link>
      
      <ul className="side-menu">
        {items.map((item, index) => (
          <li key={index} className={url === item.href ? 'active' : ''}>
            <Link href={item.href}>
              <i className={`bx ${item.icon}`}></i>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      
      <ul className="side-menu">
        <li>
          <button onClick={handleLogout} className="logout" style={{
            width: '100%',
            height: '100%',
            background: 'var(--light)',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '48px',
            fontSize: '16px',
            color: 'var(--danger)',
            whiteSpace: 'nowrap',
            overflowX: 'hidden',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'none'
          }}>
            <i className='bx bx-log-out-circle'></i>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
