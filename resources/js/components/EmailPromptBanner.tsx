import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Mail, X } from 'lucide-react';

interface EmailPromptBannerProps {
    dismissible?: boolean;
}

/**
 * Banner component to encourage users without email to add one.
 * This appears for users who registered with phone/username only.
 */
export default function EmailPromptBanner({ dismissible = true }: EmailPromptBannerProps) {
    const { auth } = usePage().props as { auth?: { user?: { email?: string } } };
    const user = auth?.user;

    const [isDismissed, setIsDismissed] = React.useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('emailPromptDismissed') === 'true';
        }
        return false;
    });

    // Don't show if user already has an email
    if (!user || user.email) {
        return null;
    }

    // Don't show if dismissed
    if (isDismissed) {
        return null;
    }

    const handleDismiss = () => {
        setIsDismissed(true);
        if (typeof window !== 'undefined') {
            localStorage.setItem('emailPromptDismissed', 'true');
        }
    };

    return (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 relative">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm text-blue-700">
                        <strong>Gợi ý:</strong> Bạn chưa thêm địa chỉ email. Thêm email để nhận thông báo đơn hàng, 
                        khuyến mãi và bảo mật tài khoản tốt hơn.
                    </p>
                    <p className="mt-2">
                        <Link
                            href={route('user.profile.index')}
                            className="text-sm font-medium text-blue-700 hover:text-blue-600 underline"
                        >
                            Thêm email ngay →
                        </Link>
                    </p>
                </div>
                {dismissible && (
                    <div className="ml-auto pl-3">
                        <button
                            onClick={handleDismiss}
                            className="inline-flex text-blue-400 hover:text-blue-500 focus:outline-none"
                            aria-label="Dismiss"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
