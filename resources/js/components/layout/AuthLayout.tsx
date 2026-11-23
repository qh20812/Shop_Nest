import { Link } from '@inertiajs/react';
import * as React from 'react';

import { cx } from '@/lib/cx';

import { AuthBrandPanel } from './AuthBrandPanel';

type AuthLayoutProps = {
    children: React.ReactNode;
    variant?: 'split' | 'centered';
    width?: 'default' | 'wide';
    brand?: React.ReactNode;
    className?: string;
};

export function AuthLayout({ children, variant = 'split', width = 'default', brand, className }: AuthLayoutProps) {
    const formClassName = cx('sn-auth__form', width === 'wide' && 'sn-auth__form--wide');

    if (variant === 'centered') {
        return (
            <div className={cx('sn-shell sn-auth', className)} data-variant="centered">
                <div className="sn-auth__top">
                    <Link href="/" className="sn-brand">
                        <img src="/image/ShopnestLogo.png" alt="ShopNest" className="sn-brand__logo" />
                        <span className="sn-brand__name">ShopNest</span>
                    </Link>
                </div>
                <main className="sn-auth__main sn-auth__main--centered">
                    <div className={formClassName}>{children}</div>
                </main>
            </div>
        );
    }

    return (
        <div className={cx('sn-shell sn-auth', className)} data-variant="split">
            <aside className="sn-auth__panel">{brand ?? <AuthBrandPanel />}</aside>
            <main className="sn-auth__main">
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
