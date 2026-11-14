import { Link, usePage } from '@inertiajs/react';
import { Palette, ShieldCheck, UserCog } from 'lucide-react';

import { cn } from '@/lib/utils';

const settingsTabs = [
    { href: '/settings/profile', label: 'Hồ sơ', icon: UserCog },
    { href: '/settings/password', label: 'Mật khẩu', icon: ShieldCheck },
    { href: '/settings/appearance', label: 'Giao diện', icon: Palette },
];

export function SettingsTabs() {
    const { url } = usePage();

    return (
        <nav aria-label="Cài đặt tài khoản" className="scrollbar-hide flex items-center gap-2 overflow-x-auto border-b border-border pb-3">
            {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const active = url.startsWith(tab.href);

                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                            'focus-ring inline-flex min-h-control-sm shrink-0 items-center gap-2 rounded-pill border px-3.5 py-2 text-body-sm font-medium transition-colors',
                            active
                                ? 'border-lacquer-red bg-lacquer-wash text-lacquer-red'
                                : 'border-border bg-warm-porcelain text-ink-muted hover:border-ink-muted hover:text-ink',
                        )}
                    >
                        <Icon aria-hidden="true" className="size-4" />
                        <span>{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default SettingsTabs;
