import { Head } from '@inertiajs/react';
import { Monitor, Moon, Sun } from 'lucide-react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import { Card } from '@/components/ui/card';
import { RadioCard } from '@/components/ui/radio-card';
import { useTheme, type Theme } from '@/hooks/useTheme';

import SettingsTabs from './SettingsTabs';
import styles from './settings.module.css';

const themeOptions: Array<{ value: Theme; label: string; description: string; icon: typeof Sun }> = [
    {
        value: 'light',
        label: 'Sáng',
        description: 'Nền giấy ấm, phù hợp môi trường nhiều ánh sáng.',
        icon: Sun,
    },
    {
        value: 'dark',
        label: 'Tối',
        description: 'Giảm chói khi dùng buổi tối.',
        icon: Moon,
    },
    {
        value: 'system',
        label: 'Theo hệ thống',
        description: 'Tự đổi theo cài đặt sáng/tối của thiết bị.',
        icon: Monitor,
    },
];

const INSET_VARIANT = 'inset' as const;

export default function SettingsAppearance() {
    const { theme, resolvedTheme, changeTheme } = useTheme();

    return (
        <AccountLayout
            active="settings"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Cài đặt' }]}
            eyebrow="Cài đặt"
            title="Giao diện"
            description="Chọn cách ShopNest hiển thị trên thiết bị của bạn."
        >
            <Head title="Cài đặt giao diện" />

            <div className={styles.stack}>
                <SettingsTabs />

                <div className={styles.grid}>
                    <Card padding="lg" className={styles.mainCard}>
                        <h2 className={styles.cardTitle}>Chủ đề</h2>
                        <div className={styles.themeList} role="radiogroup" aria-label="Chọn chủ đề giao diện">
                            {themeOptions.map((option) => {
                                const Icon = option.icon;

                                return (
                                    <RadioCard
                                        key={option.value}
                                        name="theme"
                                        value={option.value}
                                        checked={theme === option.value}
                                        onChange={() => changeTheme(option.value)}
                                        title={
                                            <span className={styles.cardHeadPlain}>
                                                <Icon aria-hidden="true" className={styles.iconAccent} />
                                                {option.label}
                                            </span>
                                        }
                                        description={option.description}
                                    />
                                );
                            })}
                        </div>
                    </Card>

                    <div className={styles.sideCard}>
                        <Card padding="lg" className={styles.cardStack}>
                            <h3 className={styles.cardTitle}>Xem trước</h3>
                            <div className={styles.previewGrid}>
                                {themeOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={styles.previewPanel}
                                        data-theme={option.value === 'system' ? resolvedTheme : option.value}
                                    >
                                        <div className={styles.previewHeader}>
                                            <span className={styles.previewLabel}>{option.label}</span>
                                        </div>
                                        <div className={styles.previewSurface}>
                                            <span className={styles.previewText}>Sản phẩm mẫu</span>
                                            <span className={styles.previewMuted}>Mô tả ngắn về sản phẩm</span>
                                            <span className={styles.previewCta}>Thêm vào giỏ</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className={styles.previewCaption}>Màu sắc lấy trực tiếp từ bảng màu của từng chủ đề.</p>
                        </Card>

                        <Card padding="lg" variant={INSET_VARIANT} className={styles.sideCard}>
                            <h3 className={styles.cardTitle}>Ghi chú</h3>
                            <p className={styles.noteText}>Lựa chọn được lưu trên trình duyệt này. Thiết bị khác có thể dùng chủ đề riêng.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
}
