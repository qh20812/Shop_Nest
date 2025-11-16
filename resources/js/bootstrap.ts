import axios, { AxiosHeaders } from 'axios';
import { configureEcho } from '@laravel/echo-react';

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

if (csrfToken) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
}

const getCookieValue = (name: string): string | null => {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`));

    if (!match) {
        return null;
    }

    const value = match.substring(name.length + 1);
    return decodeURIComponent(value);
};

axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

axios.interceptors.request.use((config) => {
    const cookieToken = getCookieValue('XSRF-TOKEN');

    if (!config.headers) {
        config.headers = new AxiosHeaders();
    }

    const headers = config.headers instanceof AxiosHeaders
        ? config.headers
        : AxiosHeaders.from(config.headers);

    if (csrfToken) {
        headers.set('X-CSRF-TOKEN', csrfToken);
    }

    if (cookieToken) {
        headers.set('X-XSRF-TOKEN', cookieToken);
    }

    config.headers = headers;

    return config;
});

const resolvePort = () => {
    const envPort = import.meta.env.VITE_REVERB_PORT;
    const parsed = Number(envPort);
    return Number.isFinite(parsed) ? parsed : 8081;
};

const host = import.meta.env.VITE_REVERB_HOST ?? window.location.hostname ?? '127.0.0.1';
const port = resolvePort();
const key = import.meta.env.VITE_REVERB_APP_KEY ?? '';

configureEcho({
    broadcaster: 'reverb',
    key,
    host,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});
