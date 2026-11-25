import { useTranslation } from '@/lib/i18n';
import { router } from '@inertiajs/react';
import * as React from 'react';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';

interface CheckoutExitConfirmationProps {
    hasUnsavedChanges: boolean;
    message?: string;
}

export default function CheckoutExitConfirmation({ hasUnsavedChanges, message }: CheckoutExitConfirmationProps) {
    const { t } = useTranslation();
    const resolvedMessage = message ?? t('Are you sure you want to leave checkout? Unsaved changes may be lost.');
    const [showModal, setShowModal] = React.useState(false);
    const pendingNavigation = React.useRef<(() => void) | null>(null);

    React.useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = resolvedMessage;
                return resolvedMessage;
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
    }, [hasUnsavedChanges, resolvedMessage, showModal]);

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
            title={t('Leave checkout?')}
            description={resolvedMessage}
            confirmLabel={t('Leave')}
            cancelLabel={t('Stay')}
            tone="warning"
            onConfirm={leave}
        />
    );
}
