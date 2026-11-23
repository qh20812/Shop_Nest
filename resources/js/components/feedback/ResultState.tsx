import { CheckCircle2, Clock3, PackageCheck, XCircle } from 'lucide-react';
import * as React from 'react';

import { cx } from '@/lib/cx';
import { formatOrderCode } from '@/lib/format';

type ResultStatus = 'success' | 'pending' | 'failure' | 'cod';

type ResultStateProps = {
    status: ResultStatus;
    orderCode?: string | number | null;
    title: React.ReactNode;
    message?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
};

const statusIcons = {
    success: CheckCircle2,
    pending: Clock3,
    failure: XCircle,
    cod: PackageCheck,
};

export function ResultState({ status, orderCode, title, message, actions, className }: ResultStateProps) {
    const Icon = statusIcons[status];
    const code = formatOrderCode(orderCode);

    return (
        <div className={cx('sn-result', className)} data-status={status}>
            <span className="sn-result__icon-wrap">
                <Icon aria-hidden="true" className="sn-result__icon" />
            </span>

            {code && <span className="sn-result__code">{code}</span>}

            <h2 className="sn-result__title">{title}</h2>
            {message && <p className="sn-result__message">{message}</p>}
            {actions && <div className="sn-result__actions">{actions}</div>}
        </div>
    );
}

export type { ResultStateProps, ResultStatus };
export default ResultState;
