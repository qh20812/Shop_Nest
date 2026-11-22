import { Link, router, usePage } from '@inertiajs/react';
import { Bell, ChevronDown, Lock, LogOut, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react';
import * as React from 'react';

import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, type DropdownMenuItemConfig } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import LanguageSwitcher from '@/components/ui/language-switcher';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/lib/i18n';

type RoleName = Record<string, string> | string | null | undefined;

type WorkspaceUser = {
    id: number;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
    role_name?: string | null;
    roles?: Array<{ name?: RoleName; display_name?: RoleName; title?: RoleName }>;
};

type PageProps = {
    auth?: { user?: WorkspaceUser | null } | null;
    [key: string]: unknown;
};

type WorkspaceTopbarProps = {
    onToggleSidebar: () => void;
};

function readRoleName(value: RoleName): string | null {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        return value;
    }

    return value.vi ?? value.en ?? Object.values(value)[0] ?? null;
}

function getDisplayName(user: WorkspaceUser | null): string {
    if (!user) {
        return '';
    }

    return [user.last_name, user.first_name].filter(Boolean).join(' ') || user.username || user.email || 'Người dùng';
}

function getRoleLabel(user: WorkspaceUser | null): string {
    if (!user) {
        return 'Thành viên';
    }

    const role = user.roles?.[0];

    return readRoleName(role?.display_name) ?? readRoleName(role?.name) ?? user.role_name ?? 'Thành viên';
}

export function WorkspaceTopbar({ onToggleSidebar }: WorkspaceTopbarProps) {
    const { props } = usePage<PageProps>();
    const user = props.auth?.user ?? null;
    const { t } = useTranslation();
    const { resolvedTheme, changeTheme } = useTheme();
    const [query, setQuery] = React.useState('');
    const [unreadCount, setUnreadCount] = React.useState(0);

    React.useEffect(() => {
        let active = true;

        const fetchUnreadCount = async () => {
            try {
                const response = await fetch('/api/notifications/unread-count');

                if (!response.ok) {
                    return;
                }

                const data = (await response.json()) as { unread_count?: number };

                if (active && typeof data.unread_count === 'number') {
                    setUnreadCount(data.unread_count);
                }
            } catch {
                // Offline or endpoint unavailable: keep the last known count.
            }
        };

        void fetchUnreadCount();
        const interval = window.setInterval(fetchUnreadCount, 30000);

        return () => {
            active = false;
            window.clearInterval(interval);
        };
    }, []);

    const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const search = query.trim();
        router.get('/search', search ? { search } : {});
    };

    const accountItems: DropdownMenuItemConfig[] = [
        { label: 'Hồ sơ', href: '/settings/profile', icon: User },
        { label: 'Đổi mật khẩu', href: '/settings/password', icon: Lock },
        { label: 'Cài đặt', href: '/settings', icon: Settings },
        { label: t('auth.logout'), icon: LogOut, destructive: true, separatorBefore: true, onSelect: () => router.post('/logout') },
    ];

    return (
        <header className="sn-workspace__topbar">
            <div className="sn-workspace__topbar-left">
                <Button variant="ghost" size="icon" className="sn-workspace__toggle" aria-label="Mở menu" onClick={onToggleSidebar}>
                    <Menu aria-hidden="true" />
                </Button>

                <form className="sn-workspace__search" onSubmit={submitSearch} role="search">
                    <Input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={t('Search...')}
                        aria-label={t('Search...')}
                        leadingIcon={Search}
                        className="sn-workspace__search-input"
                    />
                </form>
            </div>

            <div className="sn-workspace__topbar-right">
                <Button asChild variant="ghost" size="icon" className="sn-workspace__notif" aria-label={t('Notifications')}>
                    <Link href={route('notifications.index')}>
                        <Bell aria-hidden="true" />
                        {unreadCount > 0 && <span className="sn-workspace__notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                    </Link>
                </Button>

                <LanguageSwitcher />

                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={resolvedTheme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
                    onClick={() => changeTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                >
                    {resolvedTheme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
                </Button>

                {user ? (
                    <DropdownMenu
                        align="end"
                        trigger={
                            <Button variant="ghost" size="sm" className="sn-workspace__user">
                                <Avatar user={user} size="sm" />
                                <span className="sn-workspace__user-text">
                                    <span className="sn-workspace__user-name">{getDisplayName(user)}</span>
                                    <span className="sn-workspace__user-role">{getRoleLabel(user)}</span>
                                </span>
                                <ChevronDown aria-hidden="true" className="sn-workspace__chevron" />
                            </Button>
                        }
                        items={accountItems}
                    />
                ) : (
                    <Button asChild variant="secondary" size="sm">
                        <Link href="/login">Đăng nhập</Link>
                    </Button>
                )}
            </div>
        </header>
    );
}

export default WorkspaceTopbar;
