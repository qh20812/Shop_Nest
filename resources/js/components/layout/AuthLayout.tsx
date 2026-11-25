import { Link } from '@inertiajs/react';
import * as React from 'react';

import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

import { AuthBrandPanel } from './AuthBrandPanel';

type AuthLayoutProps = {
    children: React.ReactNode;
    variant?: 'split' | 'centered';
    width?: 'default' | 'wide';
    brand?: React.ReactNode;
    className?: string;
};

export function AuthLayout({ children, variant = 'split', width = 'default', brand, className }: AuthLayoutProps) {
    const { t } = useTranslation();
    const formClassName = cx('sn-auth__form', width === 'wide' && 'sn-auth__form--wide');

    if (variant === 'centered') {
        return (
            <div className={cx('sn-shell sn-auth', className)} data-variant="centered">
                <a href="#main-content" className="sn-skip-link">
                    {t('Skip to main content')}
                </a>
                <div className="sn-auth__top">
                    <Link href="/" className="sn-brand">
                        <img src="/image/ShopnestLogo.png" alt="ShopNest" className="sn-brand__logo" />
                        <span className="sn-brand__name">ShopNest</span>
                    </Link>
                </div>
                <main id="main-content" tabIndex={-1} className="sn-auth__main sn-auth__main--centered">
                    <div className={formClassName}>{children}</div>
                </main>
            </div>
        );
    }

    return (
        <div className={cx('sn-shell sn-auth', className)} data-variant="split">
            <a href="#main-content" className="sn-skip-link">
                {t('Skip to main content')}
            </a>
            <aside className="sn-auth__panel">{brand ?? <AuthBrandPanel />}</aside>
            <main id="main-content" tabIndex={-1} className="sn-auth__main">
                <div className={formClassName}>
                    <div className="sn-auth__mobile-brand">
                        <img src="/image/ShopnestLogo.png" alt="ShopNest" className="sn-brand__logo" />
                        <span className="sn-brand__name">ShopNest</span>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AuthLayout;
