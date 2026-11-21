import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

function readStoredTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'system';
    }

    try {
        const saved = window.localStorage.getItem('theme');

        if (saved === 'light' || saved === 'dark' || saved === 'system') {
            return saved;
        }
    } catch {
        // Storage may be unavailable in private mode or SSR.
    }

    return 'system';
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(readStoredTheme);
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const root = document.documentElement;

        const applyTheme = (isDark: boolean) => {
            root.dataset.theme = isDark ? 'dark' : 'light';
            root.classList.toggle('dark', isDark);
            root.style.colorScheme = isDark ? 'dark' : 'light';
            setResolvedTheme(isDark ? 'dark' : 'light');
        };

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            applyTheme(mediaQuery.matches);

            const handleChange = (event: MediaQueryListEvent) => {
                applyTheme(event.matches);
            };

            mediaQuery.addEventListener('change', handleChange);

            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }

        applyTheme(theme === 'dark');
    }, [theme]);

    const changeTheme = (newTheme: Theme) => {
        setTheme(newTheme);

        if (typeof window === 'undefined') {
            return;
        }

        try {
            window.localStorage.setItem('theme', newTheme);
        } catch {
            // Storage may be unavailable in private mode.
        }
    };

    return {
        theme,
        resolvedTheme,
        changeTheme,
    };
}
