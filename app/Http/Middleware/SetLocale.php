<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * Thứ tự ưu tiên: session (người dùng vừa bấm đổi ngôn ngữ trong trình duyệt này)
     * → locale đã lưu trên tài khoản (dùng cho thiết bị khác / email) → locale mặc định.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = Session::get('locale')
            ?? $request->user()?->preferredLocale()
            ?? config('app.locale', 'vi');

        if (in_array($locale, User::SUPPORTED_LOCALES, true)) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}
