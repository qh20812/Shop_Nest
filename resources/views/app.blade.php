<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Resolve the theme before paint; no legacy `.dark` mirror after Phase 11. --}}
    <script>
        (function () {
            try {
                var saved = localStorage.getItem('theme') || 'system';
                var dark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                var root = document.documentElement;
                root.dataset.theme = dark ? 'dark' : 'light';
                root.style.colorScheme = dark ? 'dark' : 'light';
            } catch (error) {
                document.documentElement.dataset.theme = 'light';
            }
        })();
    </script>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title data-inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="/favicon.ico?v=3">

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body>
    @inertia
</body>

</html>