import { Head, useForm, usePage } from '@inertiajs/react';
import { Camera, Save } from 'lucide-react';
import * as React from 'react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { IconButton } from '@/components/ui/icon-button';
import Input from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { cx } from '@/lib/cx';

import SettingsTabs from './SettingsTabs';
import styles from './settings.module.css';

interface UserModel {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone_number: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
}

interface PageProps extends Record<string, unknown> {
    user: UserModel;
    mustVerifyEmail?: boolean;
    status?: string;
    errors?: Record<string, string>;
}

interface SettingsProfileForm {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    avatar: File | null;
    remove_avatar: boolean;
    _method: string;
}

export default function SettingsProfile() {
    const { user } = usePage<PageProps>().props;
    const { success } = useToast();
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<SettingsProfileForm>({
        username: user.username,
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email,
        phone_number: user.phone_number ?? '',
        avatar: null as File | null,
        remove_avatar: false,
        _method: 'PATCH',
    });

    React.useEffect(
        () => () => {
            if (avatarPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
        },
        [avatarPreview],
    );

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('avatar', file);
        setData('remove_avatar', file === null);
        setAvatarPreview(file ? URL.createObjectURL(file) : null);
        event.target.value = '';
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/settings/profile', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                success('Đã cập nhật hồ sơ');
                setAvatarPreview(null);
            },
        });
    };

    return (
        <AccountLayout
            active="settings"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Cài đặt' }]}
            eyebrow="Cài đặt"
            title="Hồ sơ tài khoản"
            description="Thông tin này hiển thị với shop và dùng để liên hệ khi giao hàng."
        >
            <Head title="Cài đặt hồ sơ" />

            <div className={styles.stack}>
                <SettingsTabs />

                <form onSubmit={handleSubmit} className={styles.grid}>
                    <Card padding="lg" className={cx(styles.avatarCard, styles.avatarCol)}>
                        <Avatar
                            src={avatarPreview ?? user.avatar_url}
                            name={`${data.last_name} ${data.first_name}`.trim() || data.username}
                            size={112}
                        />
                        <input ref={fileInputRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleAvatarChange} />
                        <IconButton label="Chọn ảnh đại diện" variant="secondary" size="md" onClick={() => fileInputRef.current?.click()}>
                            <Camera aria-hidden="true" />
                        </IconButton>
                        <span className={styles.avatarHint}>JPG, PNG hoặc GIF. Tối đa 2MB.</span>
                        {errors.avatar ? (
                            <span role="alert" className={styles.avatarError}>
                                {errors.avatar}
                            </span>
                        ) : null}
                        {data.username ? (
                            <div className={styles.avatarDivider}>
                                <span className={styles.avatarUsername}>@{data.username}</span>
                            </div>
                        ) : null}
                    </Card>

                    <Card padding="lg" className={cx(styles.cardStack, styles.formCol)}>
                        <div className={styles.formGrid}>
                            <FormField label="Tên đăng nhập" error={errors.username} hint="Không thể thay đổi sau khi tạo tài khoản.">
                                <Input value={data.username} disabled autoComplete="username" />
                            </FormField>

                            <FormField label="Họ" required error={errors.last_name}>
                                <Input
                                    value={data.last_name}
                                    onChange={(event) => setData('last_name', event.target.value)}
                                    autoComplete="family-name"
                                    invalid={Boolean(errors.last_name)}
                                    required
                                />
                            </FormField>

                            <FormField label="Tên" required error={errors.first_name}>
                                <Input
                                    value={data.first_name}
                                    onChange={(event) => setData('first_name', event.target.value)}
                                    autoComplete="given-name"
                                    invalid={Boolean(errors.first_name)}
                                    required
                                />
                            </FormField>

                            <FormField label="Email" required error={errors.email}>
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    autoComplete="email"
                                    invalid={Boolean(errors.email)}
                                    required
                                />
                            </FormField>

                            <FormField label="Số điện thoại" error={errors.phone_number}>
                                <Input
                                    type="tel"
                                    value={data.phone_number}
                                    onChange={(event) => setData('phone_number', event.target.value)}
                                    autoComplete="tel"
                                    placeholder="0912 345 678"
                                    invalid={Boolean(errors.phone_number)}
                                />
                            </FormField>
                        </div>

                        <div className={styles.formFooter}>
                            {recentlySuccessful ? <span className={styles.formStatus}>Đã lưu thay đổi.</span> : null}
                            <Button type="submit" leftIcon={Save} loading={processing}>
                                Lưu thay đổi
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </AccountLayout>
    );
}
