import { Head } from '@inertiajs/react';

import SellerRegisterForm from '@/components/auth/SellerRegisterForm';
import { AuthBrandPanel } from '@/components/layout/AuthBrandPanel';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function SellerRegister() {
    return (
        <AuthLayout brand={<AuthBrandPanel role="seller" />}>
            <Head title="Đăng ký người bán" />
            <SellerRegisterForm />
        </AuthLayout>
    );
}
