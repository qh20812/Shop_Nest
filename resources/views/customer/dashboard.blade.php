<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Customer Dashboard</title>
    @vite(['resources/js/app.tsx']) {{-- nếu dùng Vite --}}
    {{-- Nếu dùng Mix, thay bằng: <link rel="stylesheet" href="{{ mix('css/app.css') }}"> <script src="{{ mix('js/app.js') }}" defer></script> --}}
</head>
<body>
    <div id="customer-dashboard"></div>
</body>
</html>