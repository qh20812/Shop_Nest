import { Head } from '@inertiajs/react';
import { Monitor, Moon, Sun } from 'lucide-react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { RadioCard } from '@/components/ui/radio-card';
import { useTheme, type Theme } from '@/hooks/useTheme';

import SettingsTabs from './SettingsTabs';

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
        description: 'Giảm chói khi dùng buổi tối. Giao diện tối còn đang thử nghiệm.',
        icon: Moon,
    },
    {
        value: 'system',
        label: 'Theo hệ thống',
        description: 'Tự đổi theo cài đặt sáng/tối của thiết bị.',
        icon: Monitor,
    },
];

export default function SettingsAppearance() {
    const { theme, changeTheme } = useTheme();

    return (
        <AccountLayout
            active="settings"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Cài đặt' }]}
            eyebrow="Cài đặt"
            title="Giao diện"
            description="Chọn cách ShopNest hiển thị trên thiết bị của bạn."
        >
            <Head title="Cài đặt giao diện" />

            <div className="flex flex-col gap-5">
                <SettingsTabs />

                <div className="grid gap-6 lg:grid-cols-12">
                    <Card padding="lg" className="flex flex-col gap-4 lg:col-span-7">
                        <h2 className="text-headline-3 text-ink">Chủ đề</h2>
                        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Chọn chủ đề giao diện">
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
                                            <span className="inline-flex items-center gap-2">
                                                <Icon aria-hidden="true" className="size-4 text-ink-muted" />
                                                {option.label}
                                            </span>
                                        }
                                        description={option.description}
                                    />
                                );
                            })}
                        </div>
                    </Card>

                    <div className="flex flex-col gap-4 lg:col-span-5">
                        <Alert
                            tone="warning"
                            title="Giao diện tối đang thử nghiệm"
                            description="Bảng màu tối chưa được thiết kế đầy đủ theo hệ Nếp. Nếu thấy khó đọc, hãy quay lại chế độ Sáng."
                        />
                        <Card padding="lg" variant="inset" className="flex flex-col gap-2">
                            <h3 className="text-headline-3 text-ink">Ghi chú</h3>
                            <p className="text-body-sm text-ink-muted">
                                Lựa chọn được lưu trên trình duyệt này. Thiết bị khác có thể dùng chủ đề riêng.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
}
