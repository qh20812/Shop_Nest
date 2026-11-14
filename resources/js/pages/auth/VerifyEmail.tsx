import { Head, useForm } from '@inertiajs/react';
import { LogOut, MailCheck } from 'lucide-react';

import { ResultState } from '@/components/feedback/ResultState';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const { post, processing } = useForm();

    const resend = () => post('/email/verification-notification');
    const logout = () => post('/logout');

    return (
        <AuthLayout variant="centered">
            <Head title="Xác thực email" />

            {status === 'verification-link-sent' && (
                <Alert
                    tone="success"
                    className="mb-5"
                    title="Đã gửi liên kết mới"
                    description="Một liên kết xác thực mới đã được gửi đến email bạn đã đăng ký."
                />
            )}

            <ResultState
                status="pending"
                title="Xác thực email của bạn"
                message="Mở liên kết xác thực trong email để hoàn tất đăng ký. Nếu chưa nhận được, bạn có thể gửi lại."
                actions={
                    <>
                        <Button loading={processing} leftIcon={MailCheck} onClick={resend}>
                            Gửi lại email xác thực
                        </Button>
                        <Button variant="ghost" leftIcon={LogOut} onClick={logout}>
                            Đăng xuất
                        </Button>
                    </>
                }
            />
        </AuthLayout>
    );
}
