import { Link, usePage } from '@inertiajs/react';
import { Bell, Lock, MapPin, MessageCircle, Package, Settings, User, Wallet } from 'lucide-react';
import * as React from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import type { BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { cx } from '@/lib/cx';
import { useTranslation } from '@/lib/i18n';

export type AccountNavKey = 'orders' | 'wallet' | 'addresses' | 'profile' | 'password' | 'notifications' | 'messages' | 'settings';

type AccountNavItem = {
    key: AccountNavKey;
    label: string;
    href: string;
    icon: typeof Package;
};

const accountNav: Array<Omit<AccountNavItem, 'label'> & { labelKey: string }> = [
    { key: 'orders', labelKey: 'Orders', href: '/user/orders', icon: Package },
    { key: 'wallet', labelKey: 'Wallet', href: '/wallet', icon: Wallet },
    { key: 'addresses', labelKey: 'Addresses', href: '/user/addresses', icon: MapPin },
    { key: 'profile', labelKey: 'Profile', href: '/user/profile', icon: User },
    { key: 'password', labelKey: 'Password', href: '/user/change-password', icon: Lock },
    { key: 'notifications', labelKey: 'Notifications', href: '/user/notifications', icon: Bell },
    { key: 'messages', labelKey: 'Messages', href: '/customer/chat', icon: MessageCircle },
    { key: 'settings', labelKey: 'Settings', href: '/settings/profile', icon: Settings },
];

function resolveActiveKey(url: string): AccountNavKey | null {
    if (url.startsWith('/settings')) {
        return 'settings';
    }

    if (url.startsWith('/user/orders')) {
        return 'orders';
    }

    if (url.startsWith('/wallet')) {
        return 'wallet';
    }

    if (url.startsWith('/user/addresses')) {
        return 'addresses';
    }

    if (url.startsWith('/user/profile')) {
        return 'profile';
    }

    if (url.startsWith('/user/change-password')) {
        return 'password';
    }

    if (url.startsWith('/user/notifications')) {
        return 'notifications';
    }

    if (url.startsWith('/customer/chat')) {
        return 'messages';
    }

    return null;
}

type AccountLayoutProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    eyebrow?: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
    count?: React.ReactNode;
    active?: AccountNavKey;
    children: React.ReactNode;
    compactFooter?: boolean;
    className?: string;
};

export function AccountLayout({
    title,
    description,
    eyebrow,
    breadcrumbs,
    actions,
    count,
    active,
    children,
    compactFooter = true,
    className,
}: AccountLayoutProps) {
    const { t } = useTranslation();
    const { url } = usePage();
    const resolvedActive = active ?? resolveActiveKey(url);

    return (
        <StorefrontLayout compactFooter={compactFooter}>
            <PageContainer className={cx('sn-account', className)}>
                <PageHeader
                    breadcrumbs={
                        breadcrumbs ?? [
                            { label: t('Market'), href: '/' },
                            { label: t('Account'), current: true },
                        ]
                    }
                    eyebrow={eyebrow}
                    title={title}
                    description={description}
                    count={count}
                    actions={actions}
                />

                <div className="sn-account__body">
                    <nav aria-label={t('Account area')} className="sn-account__nav">
                        {accountNav.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.key === resolvedActive;

                            return (
                                <Link key={item.key} href={item.href} aria-current={isActive ? 'page' : undefined} className="sn-account__tab">
                                    <Icon aria-hidden="true" className="sn-account__tab-icon" />
                                    <span>{t(item.labelKey)}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="sn-account__content">{children}</div>
                </div>
            </PageContainer>
        </StorefrontLayout>
    );
}

export type { AccountLayoutProps };
export default AccountLayout;
