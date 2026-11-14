import { useForm } from '@inertiajs/react';
import { Store, UserRound } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import { TextLink } from '@/components/ui/text-link';
import { Heading, Text } from '@/components/ui/typography';

export default function SellerRegisterForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone_number: '',
        shop_name: '',
        shop_address: '',
        password: '',
        password_confirmation: '',
    });

    React.useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, [reset]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        post(route('seller.register.store'));
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-8" aria-labelledby="seller-register-title">
            <div className="flex flex-col gap-2">
                <Heading level={1} size="headline-1" id="seller-register-title">
                    Trở thành người bán
                </Heading>
                <Text size="body-md" tone="muted">
                    Mở gian hàng trên ShopNest và tiếp cận khách hàng đang tìm đúng món đồ cho tổ ấm.
                </Text>
            </div>

            <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    <UserRound aria-hidden="true" className="size-5 text-lacquer-red" />
                    <h2 className="text-headline-3 text-ink">Thông tin cá nhân</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="Họ" required error={errors.last_name}>
                        <Input
                            value={data.last_name}
                            onChange={(event) => setData('last_name', event.target.value)}
                            autoComplete="family-name"
                            invalid={Boolean(errors.last_name)}
                        />
                    </FormField>
                    <FormField label="Tên" required error={errors.first_name}>
                        <Input
                            value={data.first_name}
                            onChange={(event) => setData('first_name', event.target.value)}
                            autoComplete="given-name"
                            invalid={Boolean(errors.first_name)}
                        />
                    </FormField>
                    <FormField label="Tên đăng nhập" required error={errors.username}>
                        <Input
                            value={data.username}
                            onChange={(event) => setData('username', event.target.value)}
                            autoComplete="username"
                            invalid={Boolean(errors.username)}
                        />
                    </FormField>
                    <FormField label="Email" required error={errors.email}>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            autoComplete="email"
                            invalid={Boolean(errors.email)}
                        />
                    </FormField>
                    <FormField label="Số điện thoại" required error={errors.phone_number}>
                        <Input
                            value={data.phone_number}
                            onChange={(event) => setData('phone_number', event.target.value)}
                            placeholder="0912 345 678"
                            autoComplete="tel"
                            invalid={Boolean(errors.phone_number)}
                        />
                    </FormField>
                </div>
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Store aria-hidden="true" className="size-5 text-lacquer-red" />
                    <h2 className="text-headline-3 text-ink">Thông tin gian hàng</h2>
                </div>
                <FormField label="Tên gian hàng" required error={errors.shop_name}>
                    <Input
                        value={data.shop_name}
                        onChange={(event) => setData('shop_name', event.target.value)}
                        placeholder="Ví dụ: TechNest"
                        autoComplete="organization"
                        invalid={Boolean(errors.shop_name)}
                    />
                </FormField>
                <FormField label="Địa chỉ kinh doanh" required error={errors.shop_address}>
                    <Input
                        value={data.shop_address}
                        onChange={(event) => setData('shop_address', event.target.value)}
                        placeholder="Số nhà, đường, phường, quận, tỉnh/thành"
                        autoComplete="street-address"
                        invalid={Boolean(errors.shop_address)}
                    />
                </FormField>
            </section>

            <section className="flex flex-col gap-4">
                <div className="border-b border-border pb-3">
                    <h2 className="text-headline-3 text-ink">Bảo mật</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField label="Mật khẩu" required error={errors.password}>
                        <Input
                            type="password"
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            autoComplete="new-password"
                            invalid={Boolean(errors.password)}
                        />
                    </FormField>
                    <FormField label="Xác nhận mật khẩu" required error={errors.password_confirmation}>
                        <Input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(event) => setData('password_confirmation', event.target.value)}
                            autoComplete="new-password"
                            invalid={Boolean(errors.password_confirmation)}
                        />
                    </FormField>
                </div>
            </section>

            <div className="flex flex-col gap-4 border-t border-border pt-6">
                <Button type="submit" size="lg" loading={processing} className="w-full">
                    Tạo tài khoản người bán
                </Button>
                <p className="text-center text-body-sm text-ink-muted">
                    Bằng việc đăng ký, bạn đồng ý với{' '}
                    <TextLink href={route('terms')} tone="accent" underline={false}>
                        Điều khoản Dịch vụ
                    </TextLink>
                    ,{' '}
                    <TextLink href={route('selling-policy')} tone="accent" underline={false}>
                        Chính sách người bán
                    </TextLink>{' '}
                    và{' '}
                    <TextLink href={route('privacy-policy')} tone="accent" underline={false}>
                        Chính sách bảo mật
                    </TextLink>
                    .
                </p>
            </div>
        </form>
    );
}
