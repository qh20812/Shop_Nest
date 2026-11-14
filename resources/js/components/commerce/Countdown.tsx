import * as React from 'react';

import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/utils';

type CountdownProps = {
    endsAt: Date | string | number | null | undefined;
    onEnd?: () => void;
    className?: string;
};

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

function CountdownBox({ children }: { children: React.ReactNode }) {
    return (
        <span className="min-w-8 rounded-chip border border-border bg-warm-porcelain px-2 py-1 text-center font-mono text-label-code font-semibold text-ink">
            {children}
        </span>
    );
}

export function Countdown({ endsAt, onEnd, className }: CountdownProps) {
    const countdown = useCountdown(endsAt, { onEnd });

    return (
        <span className={cn('inline-flex items-center gap-1.5', className)} aria-label="Thời gian còn lại">
            {countdown.days > 0 && (
                <>
                    <CountdownBox>{pad(countdown.days)}</CountdownBox>
                    <span className="text-lacquer-red">:</span>
                </>
            )}
            <CountdownBox>{pad(countdown.hours)}</CountdownBox>
            <span aria-hidden="true" className="font-semibold text-lacquer-red">
                :
            </span>
            <CountdownBox>{pad(countdown.minutes)}</CountdownBox>
            <span aria-hidden="true" className="font-semibold text-lacquer-red">
                :
            </span>
            <CountdownBox>{pad(countdown.seconds)}</CountdownBox>
        </span>
    );
}

export default Countdown;
