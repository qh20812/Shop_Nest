import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePollingOptions {
    intervalMs: number;
    enabled?: boolean;
}

interface UsePollingResult {
    refresh: () => Promise<void>;
    refreshing: boolean;
    failed: boolean;
}

/**
 * Polls a task while the tab is visible, pauses while hidden, refreshes on
 * focus, and backs off to one minute after failures. It never overlaps calls.
 */
export function usePolling(task: () => Promise<void>, { intervalMs, enabled = true }: UsePollingOptions): UsePollingResult {
    const taskRef = useRef(task);
    const inFlight = useRef(false);
    const alive = useRef(true);
    const delayRef = useRef(intervalMs);
    const [refreshing, setRefreshing] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        taskRef.current = task;
    }, [task]);

    const refresh = useCallback(async () => {
        if (inFlight.current || !alive.current) {
            return;
        }

        inFlight.current = true;
        setRefreshing(true);

        try {
            await taskRef.current();

            if (!alive.current) {
                return;
            }

            setFailed(false);
            delayRef.current = intervalMs;
        } catch {
            if (!alive.current) {
                return;
            }

            setFailed(true);
            delayRef.current = Math.min(delayRef.current * 2, 60000);
        } finally {
            inFlight.current = false;

            if (alive.current) {
                setRefreshing(false);
            }
        }
    }, [intervalMs]);

    useEffect(() => {
        alive.current = true;

        if (!enabled) {
            return undefined;
        }

        let cancelled = false;
        let timer = 0;

        const loop = () => {
            if (cancelled) {
                return;
            }

            if (document.visibilityState === 'hidden') {
                timer = window.setTimeout(loop, intervalMs);

                return;
            }

            void refresh().finally(() => {
                if (cancelled) {
                    return;
                }

                timer = window.setTimeout(loop, delayRef.current);
            });
        };

        timer = window.setTimeout(loop, intervalMs);

        const wake = () => {
            if (cancelled || document.visibilityState === 'hidden') {
                return;
            }

            window.clearTimeout(timer);
            timer = window.setTimeout(loop, 0);
        };

        document.addEventListener('visibilitychange', wake);
        window.addEventListener('focus', wake);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
            document.removeEventListener('visibilitychange', wake);
            window.removeEventListener('focus', wake);
        };
    }, [enabled, intervalMs, refresh]);

    useEffect(
        () => () => {
            alive.current = false;
        },
        [],
    );

    return { refresh, refreshing, failed };
}

export default usePolling;
