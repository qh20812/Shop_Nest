import { useCallback, useEffect, useRef, useState } from 'react';

export type CountdownValue = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isExpired: boolean;
};

const EMPTY_COUNTDOWN: CountdownValue = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isExpired: true,
};

type CountdownInput = Date | string | number | null | undefined;

type UseCountdownOptions = {
    onEnd?: () => void;
};

function resolveTarget(value: CountdownInput): number | null {
    if (value == null || value === '') {
        return null;
    }

    const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime();

    return Number.isNaN(timestamp) ? null : timestamp;
}

function calculateRemaining(target: number | null): CountdownValue {
    if (target === null) {
        return EMPTY_COUNTDOWN;
    }

    const totalSeconds = Math.max(0, Math.ceil((target - Date.now()) / 1000));
    const days = Math.floor(totalSeconds / 86_400);
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    const minutes = Math.floor((totalSeconds % 3_600) / 60);
    const seconds = totalSeconds % 60;

    return {
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        isExpired: totalSeconds <= 0,
    };
}

/**
 * Live countdown for flash sales and limited-time offers.
 *
 * Returns padded-friendly numeric parts; formatting belongs to the component.
 */
export function useCountdown(value: CountdownInput, options: UseCountdownOptions = {}): CountdownValue {
    const target = resolveTarget(value);
    const onEndRef = useRef(options.onEnd);
    const hasEndedRef = useRef(false);

    const [countdown, setCountdown] = useState<CountdownValue>(() => calculateRemaining(target));

    useEffect(() => {
        onEndRef.current = options.onEnd;
    }, [options.onEnd]);

    const tick = useCallback(() => {
        const next = calculateRemaining(target);

        setCountdown(next);

        if (next.isExpired && !hasEndedRef.current) {
            hasEndedRef.current = true;
            onEndRef.current?.();
        }
    }, [target]);

    useEffect(() => {
        hasEndedRef.current = false;
        tick();

        if (target === null || Date.now() >= target) {
            return;
        }

        const interval = window.setInterval(tick, 1_000);

        return () => window.clearInterval(interval);
    }, [target, tick]);

    return countdown;
}
