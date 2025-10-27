import React from 'react';
import { useTranslation } from '../../lib/i18n';

interface AuthSocialIconsProps {
  baseHref?: string;
}

export default function AuthSocialIcons({ baseHref = '/auth/google' }: AuthSocialIconsProps) {
  const socialLinks = [
    { href: baseHref, icon: 'bi bi-google', label: 'Google' },
  ];
  const { t } = useTranslation();

  return (
    <div className="social-icons">
      {socialLinks.map((link, index) => (
        <a key={index} href={link.href} className="icon" aria-label={link.label}>
          <i className={link.icon}></i>
          {t('Continue with')} {link.label}
        </a>
      ))}
    </div>
  );
}