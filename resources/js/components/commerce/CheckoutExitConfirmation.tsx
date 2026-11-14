import { router } from '@inertiajs/react';
import * as React from 'react';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';

interface CheckoutExitConfirmationProps {
    hasUnsavedChanges: boolean;
    message?: string;
}

export default function CheckoutExitConfirmation({
    hasUnsavedChanges,
    message = 'Bạn có chắc muốn rời khỏi trang thanh toán? Các thay đổi chưa được lưu có thể bị mất.',
}: CheckoutExitConfirmationProps) {
    const [showModal, setShowModal] = React.useState(false);
    const pendingNavigation = React.useRef<(() => void) | null>(null);

    React.useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = message;
                return message;
            }
        };

        const handleInertiaNavigate = (event: Event & { detail?: { visit?: { url?: string } } }) => {
            if (hasUnsavedChanges && !showModal) {
                event.preventDefault();
                setShowModal(true);
                pendingNavigation.current = () => {
                    if (event.detail?.visit?.url) {
                        router.visit(event.detail.visit.url);
                    }
                };
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('inertia:before', handleInertiaNavigate);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('inertia:before', handleInertiaNavigate);
        };
    }, [hasUnsavedChanges, message, showModal]);

    const stay = () => {
        setShowModal(false);
        pendingNavigation.current = null;
    };

    const leave = () => {
        setShowModal(false);
        pendingNavigation.current?.();
        pendingNavigation.current = null;
    };

    return (
        <ConfirmDialog
            open={showModal}
            onOpenChange={(open) => {
                if (!open) stay();
            }}
            title="Xác nhận rời khỏi trang"
            description={message}
            confirmLabel="Rời khỏi"
            cancelLabel="Ở lại"
            tone="warning"
            onConfirm={leave}
        />
    );
}
