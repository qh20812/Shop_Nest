import { Link, usePage } from '@inertiajs/react';
import { Palette, ShieldCheck, UserCog } from 'lucide-react';

import styles from './settings.module.css';

const settingsTabs = [
    { href: '/settings/profile', label: 'Hồ sơ', icon: UserCog },
    { href: '/settings/password', label: 'Mật khẩu', icon: ShieldCheck },
    { href: '/settings/appearance', label: 'Giao diện', icon: Palette },
];

export function SettingsTabs() {
    const { url } = usePage();

    return (
        <nav aria-label="Cài đặt tài khoản" className={styles.tabs}>
            {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const active = url.startsWith(tab.href);

                return (
                    <Link key={tab.href} href={tab.href} aria-current={active ? 'page' : undefined} className={styles.tab}>
                        <Icon aria-hidden="true" className={styles.tabIcon} />
                        <span>{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default SettingsTabs;
