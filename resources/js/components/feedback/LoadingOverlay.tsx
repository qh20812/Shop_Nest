import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

type LoadingOverlayProps = {
    visible: boolean;
    label?: string;
    className?: string;
};

export function LoadingOverlay({ visible, label = 'Đang cập nhật...', className }: LoadingOverlayProps) {
    if (!visible) {
        return null;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className={cn('absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-card bg-warm-porcelain/90', className)}
        >
            <Loader2 aria-hidden="true" className="size-6 animate-spin text-lacquer-red" />
            <span className="font-mono text-label-code text-ink-muted">{label}</span>
        </div>
    );
}

export default LoadingOverlay;
