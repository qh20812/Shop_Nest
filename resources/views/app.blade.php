<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Set the resolved theme before paint; `.dark` is a legacy mirror until Phase 11. --}}
    <script>
        (function () {
            try {
                var saved = localStorage.getItem('theme') || 'system';
                var dark = saved === 'dark' || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                var root = document.documentElement;
                root.dataset.theme = dark ? 'dark' : 'light';
                root.classList.toggle('dark', dark);
                root.style.colorScheme = dark ? 'dark' : 'light';
            } catch (error) {
                document.documentElement.dataset.theme = 'light';
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: #f6f1e6;
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title data-inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="/favicon.ico?v=3">

    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>