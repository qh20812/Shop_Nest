import { AlertTriangle, RefreshCw } from 'lucide-react';

import { cx } from '@/lib/cx';

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
        <div data-slot="error-state" data-tone="danger" className={cx('sn-empty', className)}>
            <span className="sn-empty__icon-wrap">
                <AlertTriangle aria-hidden="true" className="sn-empty__icon" />
            </span>
            <h3 className="sn-empty__title">{title}</h3>
            <p className="sn-empty__description">{description}</p>
            {onRetry && (
                <div className="sn-empty__actions">
                    <Button variant="outline" size="sm" leftIcon={RefreshCw} onClick={onRetry}>
                        {retryLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ErrorState;
