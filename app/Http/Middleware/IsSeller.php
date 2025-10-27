<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsSeller
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If user is not authenticated, return JSON for AJAX/Inertia or redirect to login
        if (!Auth::check()) {
            if ($request->expectsJson() || method_exists($request, 'inertia') && $request->inertia() || $request->header('X-Inertia')) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            return redirect()->route('login')->with('error', 'Bạn cần đăng nhập để truy cập trang này');
        }

        // Get user and check seller role defensively
        $user = Auth::user();

        $isSeller = false;
        if ($user) {
            if (method_exists($user, 'isSeller')) {
                $isSeller = $user->isSeller();
            } elseif (method_exists($user, 'hasRole')) {
                $isSeller = $user->hasRole('seller');
            } else {
                // Fallback: check a role attribute or relation
                if (method_exists($user, 'role')) {
                    try {
                        $isSeller = $user->role()->where('name->en', 'Seller')->exists();
                    } catch (\Throwable $e) {
                        $isSeller = false;
                    }
                } elseif (isset($user->role)) {
                    $isSeller = $user->role === 'seller';
                }
            }
        }

        if (!$isSeller) {
            // Return JSON 403 for AJAX/API/Inertia requests
            if ($request->expectsJson() || method_exists($request, 'inertia') && $request->inertia() || $request->header('X-Inertia')) {
                return response()->json(['message' => 'Forbidden. You do not have seller access.'], 403);
            }

            // Web redirect for normal requests
            return redirect()->route('home')->with('error', 'Bạn không có quyền truy cập trang này');
        }

        return $next($request);
    }
}