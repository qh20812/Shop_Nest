<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class HasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // Kiểm tra người dùng đã đăng nhập chưa
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Bạn cần đăng nhập để truy cập trang này');
        }

        $user = Auth::user();
        
        // Kiểm tra xem user có bất kỳ role nào được yêu cầu không
        $hasRole = false;
        foreach ($roles as $role) {
            switch (strtolower($role)) {
                case 'admin':
                    if ($user?->isAdmin()) {
                        $hasRole = true;
                        break 2;
                    }
                    break;
                case 'seller':
                    if ($user?->isSeller()) {
                        $hasRole = true;
                        break 2;
                    }
                    break;
                case 'shipper':
                    if ($user?->isShipper()) {
                        $hasRole = true;
                        break 2;
                    }
                    break;
            }
        }

        if (!$hasRole) {
            return redirect()->route('home')->with('error', 'Bạn không có quyền truy cập trang này');
        }

        // Cho phép tiếp tục nếu có role phù hợp
        return $next($request);
    }
}