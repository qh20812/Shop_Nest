<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark'=> ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    {{-- <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

    if (appearance === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersDark) {
    document.documentElement.classList.add('dark');
    }
    }
    })();
    </script> --}}

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

    <link rel="icon" href="/image/ShopnestLogoIcon.ico" sizes="any">
    <link rel="icon" href="/image/ShopnestLogoSVG.svg" type="image/svg+xml">
    <link rel="shopnest-icon" href="/image/ShopnestLogo.png">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500..700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
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