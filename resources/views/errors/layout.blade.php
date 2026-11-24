<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>@yield('title', 'Có lỗi xảy ra') - ShopNest</title>
    <style>
        @font-face {
            font-family: 'Be Vietnam Pro';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/fonts/be-vietnam-pro/be-vietnam-pro-400-latin.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
        @font-face {
            font-family: 'Be Vietnam Pro';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/fonts/be-vietnam-pro/be-vietnam-pro-400-vietnamese.woff2') format('woff2');
            unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
        }
        @font-face {
            font-family: 'Be Vietnam Pro';
            font-style: normal;
            font-weight: 600;
            font-display: swap;
            src: url('/fonts/be-vietnam-pro/be-vietnam-pro-600-latin.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
        @font-face {
            font-family: 'Be Vietnam Pro';
            font-style: normal;
            font-weight: 600;
            font-display: swap;
            src: url('/fonts/be-vietnam-pro/be-vietnam-pro-600-vietnamese.woff2') format('woff2');
            unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
        }
        @font-face {
            font-family: 'Be Vietnam Pro';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url('/fonts/be-vietnam-pro/be-vietnam-pro-700-latin.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
        @font-face {
            font-family: 'Be Vietnam Pro';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url('/fonts/be-vietnam-pro/be-vietnam-pro-700-vietnamese.woff2') format('woff2');
            unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
        }

        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }

        html,
        body {
            min-height: 100%;
        }

        body {
            margin: 0;
            background: #f2f2ee;
            color: #15160f;
            font-family: 'Be Vietnam Pro', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        .error-page {
            display: flex;
            min-height: 100dvh;
            align-items: center;
            justify-content: center;
            padding: 32px 20px;
        }

        .error-panel {
            width: 100%;
            max-width: 520px;
            padding: 40px 32px;
            border: 1px solid #d2d2ca;
            border-radius: 8px;
            background: #ffffff;
        }

        .error-brand {
            margin: 0 0 28px;
            font-size: 15px;
            font-weight: 600;
            letter-spacing: 0.02em;
            color: #15160f;
        }

        .error-code {
            margin: 0;
            font-size: clamp(56px, 12vw, 88px);
            font-variant-numeric: tabular-nums;
            font-weight: 700;
            letter-spacing: -0.03em;
            line-height: 1;
            color: #c2410c;
        }

        .error-title {
            margin: 12px 0 8px;
            font-size: 22px;
            font-weight: 600;
            line-height: 1.3;
            color: #15160f;
        }

        .error-message {
            margin: 0 0 28px;
            font-size: 15px;
            line-height: 1.6;
            color: #53564b;
        }

        .error-cta {
            display: inline-flex;
            min-height: 44px;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
            border: 1px solid #c2410c;
            border-radius: 6px;
            background: #c2410c;
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
        }

        .error-cta:hover {
            border-color: #9a3208;
            background: #9a3208;
        }

        .error-cta:focus-visible {
            outline: 2px solid #c2410c;
            outline-offset: 2px;
        }

        @media (prefers-color-scheme: dark) {
            body {
                background: #0d0f0c;
                color: #f1f2ea;
            }

            .error-panel {
                border-color: #2b3028;
                background: #151814;
            }

            .error-brand,
            .error-title {
                color: #f1f2ea;
            }

            .error-code {
                color: #ff8a5b;
            }

            .error-message {
                color: #b4b8aa;
            }

            .error-cta {
                border-color: #ff8a5b;
                background: #ff8a5b;
                color: #1a0e08;
            }

            .error-cta:hover {
                border-color: #ffa277;
                background: #ffa277;
            }

            .error-cta:focus-visible {
                outline-color: #ff8a5b;
            }
        }

        @media (max-width: 480px) {
            .error-panel {
                padding: 28px 20px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .error-cta {
                transition: none;
            }
        }
    </style>
</head>
<body>
    <main class="error-page">
        <div class="error-panel">
            <p class="error-brand">ShopNest</p>
            <p class="error-code">@yield('code')</p>
            <h1 class="error-title">@yield('title')</h1>
            <p class="error-message">@yield('message')</p>
            <a class="error-cta" href="/">Về trang chủ</a>
        </div>
    </main>
</body>
</html>
