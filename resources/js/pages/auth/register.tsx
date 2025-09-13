import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Tạo tài khoản" description="Nhập thông tin của bạn bên dưới để tạo tài khoản">
            <Head title="Register" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className='grid gap-2'>
                                <Label htmlFor='username'>Tên đăng nhập</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    name="username"
                                    placeholder="Vui lòng nhập tên đăng nhập"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">Họ & Tên Đệm</Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="first_name"
                                    placeholder="Vui lòng nhập họ và tên đệm"
                                />
                                <InputError message={errors.first_name} className="mt-2" />
                            </div>
                            <div className='grid gap-2'>
                                <Label htmlFor="last_name">Tên</Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="last_name"
                                    placeholder="Vui lòng nhập tên"
                                />
                                <InputError message={errors.last_name} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Địa Chỉ Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mật Khẩu</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Vui lòng nhập mật khẩu"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Xác Nhận Mật Khẩu</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Vui lòng nhập lại mật khẩu"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Tạo tài khoản
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Bạn đã có tài khoản?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Đăng nhập
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
