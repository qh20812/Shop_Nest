import { Link, usePage } from '@inertiajs/react';
import { Bell, Lock, MapPin, MessageCircle, Package, Settings, User } from 'lucide-react';
import * as React from 'react';

import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { StorefrontLayout } from '@/components/layout/StorefrontLayout';
import type { BreadcrumbItem } from '@/components/ui/breadcrumbs';
import { cn } from '@/lib/utils';

export type AccountNavKey = 'orders' | 'addresses' | 'profile' | 'password' | 'notifications' | 'messages' | 'settings';

type AccountNavItem = {
    key: AccountNavKey;
    label: string;
    href: string;
    icon: typeof Package;
};

const accountNav: AccountNavItem[] = [
    { key: 'orders', label: 'Đơn hàng', href: '/user/orders', icon: Package },
    { key: 'addresses', label: 'Địa chỉ', href: '/user/addresses', icon: MapPin },
    { key: 'profile', label: 'Hồ sơ', href: '/user/profile', icon: User },
    { key: 'password', label: 'Mật khẩu', href: '/user/change-password', icon: Lock },
    { key: 'notifications', label: 'Thông báo', href: '/user/notifications', icon: Bell },
    { key: 'messages', label: 'Tin nhắn', href: '/customer/chat', icon: MessageCircle },
    { key: 'settings', label: 'Cài đặt', href: '/settings/profile', icon: Settings },
];

function resolveActiveKey(url: string): AccountNavKey | null {
    if (url.startsWith('/settings')) {
        return 'settings';
    }

    if (url.startsWith('/user/orders')) {
        return 'orders';
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
    const { url } = usePage();
    const resolvedActive = active ?? resolveActiveKey(url);

    return (
        <StorefrontLayout compactFooter={compactFooter}>
            <PageContainer className={cn('py-8 md:py-10', className)}>
                <PageHeader
                    breadcrumbs={breadcrumbs ?? [{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }]}
                    eyebrow={eyebrow}
                    title={title}
                    description={description}
                    count={count}
                    actions={actions}
                />

                <nav aria-label="Khu vực tài khoản" className="scrollbar-hide mt-5 flex items-center gap-2 overflow-x-auto pb-1">
                    {accountNav.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.key === resolvedActive;

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    'focus-ring inline-flex min-h-control-sm shrink-0 items-center gap-2 rounded-pill border px-3.5 py-2 text-body-sm font-medium transition-colors',
                                    isActive
                                        ? 'border-lacquer-red bg-lacquer-wash text-lacquer-red'
                                        : 'border-border bg-warm-porcelain text-ink-muted hover:border-ink-muted hover:text-ink',
                                )}
                            >
                                <Icon aria-hidden="true" className="size-4" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-6">{children}</div>
            </PageContainer>
        </StorefrontLayout>
    );
}

export type { AccountLayoutProps };
export default AccountLayout;
