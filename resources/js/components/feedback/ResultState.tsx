import { CheckCircle2, Clock3, PackageCheck, XCircle } from 'lucide-react';
import * as React from 'react';

import { formatOrderCode } from '@/lib/format';
import { cn } from '@/lib/utils';

type ResultStatus = 'success' | 'pending' | 'failure' | 'cod';

type ResultStateProps = {
    status: ResultStatus;
    orderCode?: string | number | null;
    title: React.ReactNode;
    message?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
};

const statusConfig = {
    success: {
        icon: CheckCircle2,
        wrapper: 'bg-jade-soft text-jade',
    },
    pending: {
        icon: Clock3,
        wrapper: 'bg-turmeric-soft text-turmeric',
    },
    failure: {
        icon: XCircle,
        wrapper: 'bg-brick-soft text-brick',
    },
    cod: {
        icon: PackageCheck,
        wrapper: 'bg-lacquer-wash text-lacquer-deep',
    },
};

export function ResultState({ status, orderCode, title, message, actions, className }: ResultStateProps) {
    const config = statusConfig[status];
    const Icon = config.icon;
    const code = formatOrderCode(orderCode);

    return (
        <div className={cn('flex w-full flex-col items-center text-center', className)}>
            <span className={cn('flex size-16 items-center justify-center rounded-pill', config.wrapper)}>
                <Icon aria-hidden="true" className="size-8" />
            </span>
            {code && (
                <span className="mt-5 inline-flex items-center rounded-chip border border-border bg-raw-linen px-3 py-1 font-mono text-label-code text-ink">
                    {code}
                </span>
            )}
            <h2 className="mt-4 text-headline-2 text-ink">{title}</h2>
            {message && <p className="mt-2 max-w-lg text-body-md text-ink-muted">{message}</p>}
            {actions && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{actions}</div>}
        </div>
    );
}

export type { ResultStateProps, ResultStatus };
export default ResultState;
