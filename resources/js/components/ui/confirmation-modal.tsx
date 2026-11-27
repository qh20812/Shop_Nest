import * as React from 'react';

import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

/**
 * Compatibility wrapper from Phase 2. Delegates to the shared `ConfirmDialog`
 * so Seller pages get the Radix dialog, focus trap and plain-CSS styling while
 * keeping the legacy prop names.
 */
export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmLabel, cancelLabel }: ConfirmationModalProps) {
    return (
        <ConfirmDialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
            title={title}
            description={message}
            confirmLabel={confirmLabel}
            cancelLabel={cancelLabel}
            tone="danger"
            onConfirm={() => {
                onConfirm();
                onClose();
            }}
        />
    );
}
