import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { AdminQueueState, AdminTopup } from '@/components/wallet/types';

import { usePolling } from './usePolling';

interface AdminQueueResponse {
    success: boolean;
    data: AdminTopup[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    statusCounts: Record<string, number>;
    filters: { status: string; code: string };
    server_time: string;
}

/**
 * Keeps the review queue and its status counts current without Inertia
 * reloads. Reviews update the row and counts locally, then a silent refresh
 * restores the server ordering.
 */
export function useAdminTopupQueue(initial: AdminQueueState) {
    const [topups, setTopups] = useState(initial.topups);
    const [statusCounts, setStatusCounts] = useState(initial.statusCounts);
    const [lastUpdatedAt, setLastUpdatedAt] = useState(initial.server_time);
    const [newIds, setNewIds] = useState<number[]>([]);

    const knownIds = useRef<Set<number>>(new Set(initial.topups.data.map((topup) => topup.topup_id)));
    const highlightTimer = useRef(0);

    useEffect(() => {
        setTopups(initial.topups);
        setStatusCounts(initial.statusCounts);
        setLastUpdatedAt(initial.server_time);
        setNewIds([]);
        knownIds.current = new Set(initial.topups.data.map((topup) => topup.topup_id));
    }, [initial]);

    useEffect(
        () => () => {
            window.clearTimeout(highlightTimer.current);
        },
        [],
    );

    const status = initial.filters.status || 'all';
    const code = initial.filters.code;
    const page = topups.current_page;

    const refresh = useCallback(async () => {
        const { data } = await axios.get<AdminQueueResponse>('/admin/wallet-topups', {
            params: {
                status,
                code: code || undefined,
                page,
            },
        });

        const fresh = data.data.filter((topup) => !knownIds.current.has(topup.topup_id)).map((topup) => topup.topup_id);
        data.data.forEach((topup) => knownIds.current.add(topup.topup_id));

        setTopups((previous) => ({
            ...previous,
            data: data.data,
            current_page: data.pagination.current_page,
            last_page: data.pagination.last_page,
            per_page: data.pagination.per_page,
            total: data.pagination.total,
            from: data.pagination.from,
            to: data.pagination.to,
        }));
        setStatusCounts(data.statusCounts);
        setLastUpdatedAt(data.server_time);

        if (fresh.length > 0) {
            setNewIds(fresh);
            window.clearTimeout(highlightTimer.current);
            highlightTimer.current = window.setTimeout(() => setNewIds([]), 10000);
        }
    }, [status, code, page]);

    const { refreshing, failed } = usePolling(refresh, { intervalMs: 8000 });

    const applyReviewed = useCallback(
        (reviewed: AdminTopup, counts: Record<string, number>) => {
            setStatusCounts(counts);
            setTopups((previous) => {
                const inFilter = status === 'all' || status === reviewed.status;
                const exists = previous.data.some((topup) => topup.topup_id === reviewed.topup_id);

                if (!inFilter) {
                    return exists
                        ? {
                              ...previous,
                              data: previous.data.filter((topup) => topup.topup_id !== reviewed.topup_id),
                              total: Math.max(0, previous.total - 1),
                          }
                        : previous;
                }

                if (exists) {
                    return {
                        ...previous,
                        data: previous.data.map((topup) => (topup.topup_id === reviewed.topup_id ? reviewed : topup)),
                    };
                }

                return { ...previous, data: [reviewed, ...previous.data], total: previous.total + 1 };
            });
        },
        [status],
    );

    return {
        topups,
        statusCounts,
        lastUpdatedAt,
        newIds,
        refreshing,
        failed,
        refresh,
        applyReviewed,
    };
}

export default useAdminTopupQueue;
