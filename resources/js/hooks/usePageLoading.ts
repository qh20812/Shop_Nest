import { useState, useEffect } from 'react';

interface UsePageLoadingOptions {
    delay?: number;
    minLoadingTime?: number;
}

export function usePageLoading({ delay = 0, minLoadingTime = 0 }: UsePageLoadingOptions = {}) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const startTime = Date.now();

        const timer = setTimeout(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minLoadingTime - elapsed);

            setTimeout(() => {
                setIsLoading(false);
            }, remaining);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay, minLoadingTime]);

    return isLoading;
}
