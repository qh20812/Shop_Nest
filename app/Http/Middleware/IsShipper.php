<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsShipper
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra người dùng đã đăng nhập chưa
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Bạn cần đăng nhập để truy cập trang này');
        }

        // Lấy thông tin user và kiểm tra quyền shipper với null safety
        $user = Auth::user();
        if (!$user?->isShipper()) {
            return redirect()->route('home')->with('error', 'Bạn không có quyền truy cập trang này');
        }

        // Cho phép tiếp tục nếu là shipper
        return $next($request);
    }
}