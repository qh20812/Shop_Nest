import { AlertTriangle, Trash2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: React.ReactNode;
    description: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: 'danger' | 'warning';
    loading?: boolean;
    onConfirm: () => void;
    className?: string;
};

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Xác nhận',
    cancelLabel = 'Giữ lại',
    tone = 'danger',
    loading = false,
    onConfirm,
    className,
}: ConfirmDialogProps) {
    const Icon = tone === 'danger' ? Trash2 : AlertTriangle;

    return (
        <DialogRoot open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className}>
                <div className="flex items-start gap-3">
                    <span
                        className={cn(
                            'flex size-11 shrink-0 items-center justify-center rounded-pill',
                            tone === 'danger' ? 'bg-brick-soft text-brick' : 'bg-turmeric-soft text-turmeric',
                        )}
                    >
                        <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button variant={tone === 'danger' ? 'destructive' : 'primary'} loading={loading} onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
}

export default ConfirmDialog;
