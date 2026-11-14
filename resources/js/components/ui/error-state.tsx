import { AlertTriangle, RefreshCw } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';

type ErrorStateProps = {
    title?: string;
    description?: string;
    retryLabel?: string;
    onRetry?: () => void;
    className?: string;
};

export function ErrorState({
    title = 'Không tải được dữ liệu',
    description = 'Đã có lỗi xảy ra. Thử lại sau ít phút.',
    retryLabel = 'Thử lại',
    onRetry,
    className,
}: ErrorStateProps) {
    return (
        <div
            className={cn(
                'flex w-full flex-col items-center justify-center rounded-card border border-border bg-warm-porcelain px-6 py-12 text-center',
                className,
            )}
        >
            <span className="mb-4 flex size-14 items-center justify-center rounded-pill bg-brick-soft text-brick">
                <AlertTriangle aria-hidden="true" className="size-7" />
            </span>
            <h3 className="text-headline-3 text-ink">{title}</h3>
            <p className="mt-2 max-w-md text-body-md text-ink-muted">{description}</p>
            {onRetry && (
                <Button variant="outline" size="sm" className="mt-6" leftIcon={RefreshCw} onClick={onRetry}>
                    {retryLabel}
                </Button>
            )}
        </div>
    );
}

export default ErrorState;
