import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';
import * as React from 'react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { useToast } from '@/components/ui/toast';

interface PageProps extends Record<string, unknown> {
    errors?: Record<string, string>;
}

interface PasswordForm {
    current_password: string;
    new_password: string;
    confirm_password: string;
    [key: string]: string;
}

const emptyForm: PasswordForm = {
    current_password: '',
    new_password: '',
    confirm_password: '',
};

export default function ChangePasswordIndex() {
    const { errors: pageErrors = {} } = usePage<PageProps>().props;
    const { success, error: showError } = useToast();
    const [form, setForm] = React.useState<PasswordForm>(emptyForm);
    const [errors, setErrors] = React.useState<Record<string, string>>(pageErrors);
    const [show, setShow] = React.useState({ current: false, next: false, confirm: false });
    const [processing, setProcessing] = React.useState(false);

    React.useEffect(() => {
        setErrors(pageErrors);
    }, [pageErrors]);

    const update = (field: keyof PasswordForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm((current) => ({ ...current, [field]: event.target.value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setErrors({});

        if (form.new_password !== form.confirm_password) {
            setErrors({ confirm_password: 'Mật khẩu xác nhận không khớp.' });
            return;
        }

        setProcessing(true);

        router.post('/user/change-password', form, {
            preserveScroll: true,
            onSuccess: () => {
                setForm(emptyForm);
                success('Đã đổi mật khẩu');
            },
            onError: (nextErrors) => {
                setErrors(nextErrors as Record<string, string>);
                showError('Không thể đổi mật khẩu', 'Vui lòng kiểm tra lại mật khẩu hiện tại.');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const isValid = Boolean(form.current_password && form.new_password && form.confirm_password);

    return (
        <AccountLayout
            active="password"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Mật khẩu' }]}
            eyebrow="Bảo mật"
            title="Đổi mật khẩu"
            description="Dùng mật khẩu dài, khó đoán và không chia sẻ với người khác."
            actions={
                <Button variant="secondary" size="sm" leftIcon={ArrowLeft} asChild>
                    <Link href="/user/profile">Về hồ sơ</Link>
                </Button>
            }
        >
            <Head title="Đổi mật khẩu" />

            <div className="grid gap-6 lg:grid-cols-12">
                <Card padding="lg" className="lg:col-span-7">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex items-center gap-2 border-b border-border pb-3">
                            <KeyRound aria-hidden="true" className="size-4 text-lacquer-red" />
                            <h2 className="text-headline-3 text-ink">Mật khẩu đăng nhập</h2>
                        </div>

                        <FormField label="Mật khẩu hiện tại" required error={errors.current_password}>
                            <Input
                                type={show.current ? 'text' : 'password'}
                                value={form.current_password}
                                onChange={update('current_password')}
                                autoComplete="current-password"
                                invalid={Boolean(errors.current_password)}
                                trailing={
                                    <button
                                        type="button"
                                        aria-label={show.current ? 'Ẩn mật khẩu hiện tại' : 'Hiện mật khẩu hiện tại'}
                                        className="focus-ring flex size-control-sm items-center justify-center rounded-chip text-ink-muted transition-colors hover:bg-raw-linen hover:text-ink"
                                        onClick={() => setShow((current) => ({ ...current, current: !current.current }))}
                                    >
                                        {show.current ? (
                                            <EyeOff aria-hidden="true" className="size-4" />
                                        ) : (
                                            <Eye aria-hidden="true" className="size-4" />
                                        )}
                                    </button>
                                }
                                required
                            />
                        </FormField>

                        <FormField label="Mật khẩu mới" required error={errors.new_password}>
                            <Input
                                type={show.next ? 'text' : 'password'}
                                value={form.new_password}
                                onChange={update('new_password')}
                                autoComplete="new-password"
                                invalid={Boolean(errors.new_password)}
                                trailing={
                                    <button
                                        type="button"
                                        aria-label={show.next ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'}
                                        className="focus-ring flex size-control-sm items-center justify-center rounded-chip text-ink-muted transition-colors hover:bg-raw-linen hover:text-ink"
                                        onClick={() => setShow((current) => ({ ...current, next: !current.next }))}
                                    >
                                        {show.next ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
                                    </button>
                                }
                                required
                            />
                        </FormField>

                        <PasswordStrength value={form.new_password} />

                        <FormField label="Xác nhận mật khẩu mới" required error={errors.confirm_password}>
                            <Input
                                type={show.confirm ? 'text' : 'password'}
                                value={form.confirm_password}
                                onChange={update('confirm_password')}
                                autoComplete="new-password"
                                invalid={Boolean(errors.confirm_password)}
                                trailing={
                                    <button
                                        type="button"
                                        aria-label={show.confirm ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                                        className="focus-ring flex size-control-sm items-center justify-center rounded-chip text-ink-muted transition-colors hover:bg-raw-linen hover:text-ink"
                                        onClick={() => setShow((current) => ({ ...current, confirm: !current.confirm }))}
                                    >
                                        {show.confirm ? (
                                            <EyeOff aria-hidden="true" className="size-4" />
                                        ) : (
                                            <Eye aria-hidden="true" className="size-4" />
                                        )}
                                    </button>
                                }
                                required
                            />
                        </FormField>

                        <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                            <Button type="button" variant="secondary" asChild>
                                <Link href="/user/profile">Huỷ</Link>
                            </Button>
                            <Button type="submit" loading={processing} disabled={!isValid}>
                                Cập nhật mật khẩu
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card padding="lg" variant="inset" className="flex flex-col gap-3 lg:col-span-5">
                    <h3 className="text-headline-3 text-ink">Mẹo bảo mật</h3>
                    <ul className="flex list-disc flex-col gap-2 pl-5 text-body-sm text-ink-muted">
                        <li>Mật khẩu tối thiểu 8 ký tự, nên có chữ hoa, số và ký tự đặc biệt.</li>
                        <li>Không dùng lại mật khẩu của email hoặc mạng xã hội.</li>
                        <li>Đăng xuất khỏi thiết bị lạ sau khi đổi mật khẩu.</li>
                    </ul>
                </Card>
            </div>
        </AccountLayout>
    );
}
