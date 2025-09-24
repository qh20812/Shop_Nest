<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(!Auth::check()){
            return redirect()->route('login')->with('error','Bạn cần đăng nhập để truy cập trang này');
        }
        if(!Auth::users()->isAdmin()){
            return redirect()->route('dashboard')->with('error','Bạn không có quyền truy cập trang này');
        }
        if(Auth::users()->isAdmin()){
            return $next($request);
        }
        return redirect()->route('dashboard')->with('error','Bạn không có quyền truy cập trang này');
    }
}
