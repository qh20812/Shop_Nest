export const readMetaCsrfToken = (): string | null => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    return token && token.length > 0 ? token : null;
};

export const readCookieCsrfToken = (): string | null => {
    const raw = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='));

    if (!raw) {
        return null;
    }

    const value = raw.substring('XSRF-TOKEN='.length);
    return value ? decodeURIComponent(value) : null;
};

export const resolveCsrfToken = (): string => {
    return readMetaCsrfToken() ?? readCookieCsrfToken() ?? '';
};

export const appendCsrfToken = <T extends Record<string, unknown>>(payload: T, token: string = resolveCsrfToken()): T & { _token: string } => {
    return {
        ...payload,
        _token: token,
    };
};
