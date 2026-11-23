import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    /*
     * Laravel serves `public/` itself, so the plugin defaults `publicDir` to false.
     * That breaks CSS `url()` assets in dev: the stylesheet is loaded from the Vite
     * origin, so `/fonts/...` resolves to :5173 and 404s. Serving the folder in dev
     * (without copying it into `public/build`) keeps self-hosted fonts working.
     */
    publicDir: 'public',
    build: {
        copyPublicDir: false,
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            jsxRuntime: 'automatic',
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
        target: 'esnext',
    },
    optimizeDeps: {
        include: ['@tinymce/tinymce-react'],
        force: true
    },
    server: {
        fs: {
            allow: ['..']
        },
        hmr: {
            host: 'localhost',
        },
        host: 'localhost'
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
        dedupe: ['react', 'react-dom']
    }
});
