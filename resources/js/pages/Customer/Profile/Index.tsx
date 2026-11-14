import { Head, Link, router, usePage } from '@inertiajs/react';
import { Camera, Lock, Save, UserRound } from 'lucide-react';
import * as React from 'react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import Avatar from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { IconButton } from '@/components/ui/icon-button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';

interface UserProfile {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone_number: string | null;
    gender: string | null;
    date_of_birth: string | null;
    avatar: string | null;
    avatar_url?: string | null;
}

interface PageProps extends Record<string, unknown> {
    user: UserProfile;
    errors?: Record<string, string>;
}

interface FormState {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: string;
    date_of_birth: string;
}

const profileFields: Array<keyof FormState> = ['first_name', 'last_name', 'email', 'phone_number', 'gender', 'date_of_birth'];

function toFormState(user: UserProfile): FormState {
    return {
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
        phone_number: user.phone_number ?? '',
        gender: user.gender ?? '',
        date_of_birth: user.date_of_birth ?? '',
    };
}

export default function ProfileIndex() {
    const { user, errors = {} } = usePage<PageProps>().props;
    const { success, error: showError } = useToast();

    const [form, setForm] = React.useState<FormState>(() => toFormState(user));
    const initialRef = React.useRef<FormState>(toFormState(user));
    const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
    const [processing, setProcessing] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        const next = toFormState(user);
        initialRef.current = next;
        setForm(next);
        setAvatarFile(null);
        setAvatarPreview((current) => {
            if (current?.startsWith('blob:')) {
                URL.revokeObjectURL(current);
            }
            return null;
        });
    }, [user]);

    React.useEffect(
        () => () => {
            if (avatarPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(avatarPreview);
            }
        },
        [avatarPreview],
    );

    const updateField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((current) => ({ ...current, [field]: event.target.value }));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setAvatarFile(file);

        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }

        event.target.value = '';
    };

    const isDirty = Boolean(avatarFile) || profileFields.some((field) => form[field] !== initialRef.current[field]);

    const handleReset = () => {
        setForm(initialRef.current);
        setAvatarFile(null);
        setAvatarPreview((current) => {
            if (current?.startsWith('blob:')) {
                URL.revokeObjectURL(current);
            }
            return null;
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const payload = new FormData();
        payload.append('_method', 'PUT');
        profileFields.forEach((field) => payload.append(field, form[field]));
        if (avatarFile) {
            payload.append('avatar', avatarFile);
        }

        setProcessing(true);

        router.post('/user/profile', payload, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                success('Đã lưu thông tin cá nhân');
            },
            onError: () => showError('Vui lòng kiểm tra lại thông tin'),
            onFinish: () => setProcessing(false),
        });
    };

    const maxBirthDate = React.useMemo(() => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 18);
        return date.toISOString().slice(0, 10);
    }, []);

    return (
        <AccountLayout
            active="profile"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Hồ sơ' }]}
            eyebrow="Tài khoản"
            title="Thông tin cá nhân"
            description="Cập nhật hồ sơ để shop và bưu tá liên hệ đúng người, đúng địa chỉ."
            actions={
                <Button variant="secondary" size="sm" leftIcon={Lock} asChild>
                    <Link href="/user/change-password">Đổi mật khẩu</Link>
                </Button>
            }
        >
            <Head title="Thông tin cá nhân" />

            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-12">
                <Card padding="lg" className="flex flex-col items-center gap-3 lg:col-span-4">
                    <Avatar src={avatarPreview ?? user.avatar_url} name={`${form.last_name} ${form.first_name}`.trim() || user.username} size={112} />
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    <IconButton label="Chọn ảnh đại diện" variant="secondary" size="md" onClick={() => fileInputRef.current?.click()}>
                        <Camera aria-hidden="true" />
                    </IconButton>
                    <div className="text-center">
                        <span className="block text-body-sm font-medium text-ink">Ảnh đại diện</span>
                        <span className="text-label-micro text-ink-faint">JPG, PNG hoặc GIF. Tối đa 2MB.</span>
                    </div>
                    {errors.avatar && (
                        <span role="alert" className="text-body-sm text-brick">
                            {errors.avatar}
                        </span>
                    )}
                    <div className="w-full border-t border-border pt-3 text-center">
                        <span className="font-mono text-label-code text-ink-muted">@{user.username}</span>
                    </div>
                </Card>

                <Card padding="lg" className="flex flex-col gap-5 lg:col-span-8">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                        <UserRound aria-hidden="true" className="size-4 text-lacquer-red" />
                        <h2 className="text-headline-3 text-ink">Hồ sơ của bạn</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Họ" error={errors.last_name}>
                            <Input
                                value={form.last_name}
                                onChange={updateField('last_name')}
                                autoComplete="family-name"
                                invalid={Boolean(errors.last_name)}
                            />
                        </FormField>

                        <FormField label="Tên" error={errors.first_name}>
                            <Input
                                value={form.first_name}
                                onChange={updateField('first_name')}
                                autoComplete="given-name"
                                invalid={Boolean(errors.first_name)}
                            />
                        </FormField>

                        <FormField label="Email" required error={errors.email} className="sm:col-span-2">
                            <Input
                                type="email"
                                value={form.email}
                                onChange={updateField('email')}
                                autoComplete="email"
                                invalid={Boolean(errors.email)}
                                required
                            />
                        </FormField>

                        <FormField label="Số điện thoại" error={errors.phone_number} hint="Dùng để bưu tá liên hệ khi giao hàng.">
                            <Input
                                type="tel"
                                value={form.phone_number}
                                onChange={updateField('phone_number')}
                                autoComplete="tel"
                                placeholder="0912 345 678"
                                invalid={Boolean(errors.phone_number)}
                            />
                        </FormField>

                        <FormField label="Giới tính" error={errors.gender}>
                            <Select
                                value={form.gender}
                                onChange={updateField('gender')}
                                placeholder="Chọn giới tính"
                                options={[
                                    { value: 'male', label: 'Nam' },
                                    { value: 'female', label: 'Nữ' },
                                    { value: 'other', label: 'Khác' },
                                ]}
                                invalid={Boolean(errors.gender)}
                            />
                        </FormField>

                        <FormField label="Ngày sinh" error={errors.date_of_birth} hint="Bạn cần đủ 18 tuổi để đặt hàng.">
                            <Input
                                type="date"
                                value={form.date_of_birth}
                                onChange={updateField('date_of_birth')}
                                max={maxBirthDate}
                                invalid={Boolean(errors.date_of_birth)}
                            />
                        </FormField>
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                        <Button type="button" variant="secondary" onClick={handleReset} disabled={!isDirty || processing}>
                            Hoàn tác
                        </Button>
                        <Button type="submit" leftIcon={Save} loading={processing} disabled={!isDirty}>
                            Lưu thay đổi
                        </Button>
                    </div>
                </Card>
            </form>
        </AccountLayout>
    );
}
