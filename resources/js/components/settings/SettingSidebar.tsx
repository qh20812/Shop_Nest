
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';

export default function SettingsSidebar() {
  const { t } = useTranslation();
  const { url } = usePage();

  const menuItems = [
    {
      label: t('navbar.profile'),
      icon: 'bx bx-user',
      href: '/settings/profile',
      active: url.startsWith('/settings/profile') || url === '/settings',
    },
    {
      label: t('Password'),
      icon: 'bx bx-lock',
      href: '/settings/password',
      active: url.startsWith('/settings/password'),
    },
    {
      label: t('Appearance'),
      icon: 'bx bx-palette',
      href: '/settings/appearance',
      active: url.startsWith('/settings/appearance'),
    },
  ];

  return (
    <div style={{ width: '280px', flexShrink: 0 }}>
      <div 
        style={{
          background: 'var(--light)',
          borderRadius: '20px',
          padding: '24px 0',
          height: 'fit-content',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ padding: '0 24px', marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: 'var(--dark)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <i className='bx bx-cog' style={{ fontSize: '24px' }}></i>
            {t('navbar.settings')}
          </h2>
        </div>

        <div>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                color: item.active ? 'var(--primary)' : 'var(--dark)',
                background: item.active ? 'var(--light-primary)' : 'transparent',
                textDecoration: 'none',
                fontWeight: item.active ? '500' : '400',
                borderLeft: item.active ? '3px solid var(--primary)' : 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = 'var(--grey)';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <i className={item.icon} style={{ fontSize: '20px' }}></i>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
