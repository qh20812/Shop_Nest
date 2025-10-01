import React from 'react';

interface AuthSocialIconsProps {
  baseHref?: string;
}

export default function AuthSocialIcons({ baseHref = '/auth/google' }: AuthSocialIconsProps) {
  const socialLinks = [
    { href: baseHref, icon: 'fa-brands fa-google-plus-g', label: 'Google' },
  ];

  return (
    <div className="social-icons">
      {socialLinks.map((link, index) => (
        <a key={index} href={link.href} className="icon" aria-label={link.label}>
          <i className={link.icon}></i>
          Continue with {link.label}
        </a>
      ))}
    </div>
  );
}