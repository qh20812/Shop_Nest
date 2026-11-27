import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import type { WalletState, WalletStateResponse, WalletTopup } from '@/components/wallet/types';

import { usePolling } from './usePolling';

function stripTime(response: WalletStateResponse): WalletState {
    return response;
}

/**
 * Owns the live wallet state. Inertia props seed it; polling and API actions
 * replace it in place so the page never reloads for a top-up update.
 */
export function useWalletState(initial: WalletStateResponse) {
    const [state, setState] = useState<WalletState>(() => stripTime(initial));
    const [lastUpdatedAt, setLastUpdatedAt] = useState(initial.server_time);

    useEffect(() => {
        setState(stripTime(initial));
        setLastUpdatedAt(initial.server_time);
    }, [initial]);

    const { type, from, to } = initial.filters;
    const page = initial.transactions.current_page;

    const refresh = useCallback(async () => {
        const params: Record<string, string | number> = { page };

        if (type) {
            params.type = type;
        }

        if (from) {
            params.from = from;
        }

        if (to) {
            params.to = to;
        }

        const { data } = await axios.get<WalletStateResponse>('/wallet/state', { params });

        setState(stripTime(data));
        setLastUpdatedAt(data.server_time);
    }, [type, from, to, page]);

    const { refreshing, failed } = usePolling(refresh, { intervalMs: 10000 });

    const applyTopup = useCallback(
        (topup: WalletTopup | null) => {
            setState((previous) => ({ ...previous, activeTopup: topup }));
            void refresh();
        },
        [refresh],
    );

    return {
        state,
        lastUpdatedAt,
        refreshing,
        failed,
        refresh,
        applyTopup,
    };
}

export default useWalletState;
