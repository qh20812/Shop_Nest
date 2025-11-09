<?php
namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    // Rate limiting configuration
    private const MAX_ATTEMPTS = 5;
    private const DECAY_MINUTES = 1;
    
    // Cache configuration
    private const CACHE_TTL_SECONDS = 300; // 5 minutes
    
    // Key prefixes
    private const CACHE_KEY_PREFIX = 'user_admin_status_';
    private const RATE_LIMIT_KEY_PREFIX = 'admin_access_';

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra người dùng đã đăng nhập chưa
        if (!Auth::check()) {
            $rateLimitResponse = $this->handleRateLimitedAccess($request, null, 'authentication');
            if ($rateLimitResponse) {
                return $rateLimitResponse;
            }

            // Log authentication failure
            Log::warning('Admin middleware: Authentication failed', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'route' => $request->route()?->getName(),
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'timestamp' => now()->toISOString(),
            ]);

            return redirect()->route('login')->with('error', 'Bạn cần đăng nhập để truy cập trang này');
        }

        // Lấy thông tin user và kiểm tra quyền admin với null safety
        // Cache result for CACHE_TTL_SECONDS to improve performance
        $user = Auth::user();
        $isAdmin = Cache::remember(self::CACHE_KEY_PREFIX . $user->id, self::CACHE_TTL_SECONDS, function () use ($user) {
            return $user->isAdmin();
        });
        if (!$isAdmin) {
            $rateLimitResponse = $this->handleRateLimitedAccess($request, $user, 'authorization');
            if ($rateLimitResponse) {
                return $rateLimitResponse;
            }

            // Log authorization failure
            Log::warning('Admin middleware: Authorization failed - User is not admin', [
                'user_id' => $user?->id,
                'user_email' => $user?->email,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'route' => $request->route()?->getName(),
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'timestamp' => now()->toISOString(),
                'user_roles' => $user?->roles ?? 'none', // Assuming roles relationship exists
            ]);

            return redirect()->route('home')->with('error', 'Bạn không có quyền truy cập trang này');
        }

        // Log successful admin access
        Log::info('Admin middleware: Access granted', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'route' => $request->route()?->getName(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'timestamp' => now()->toISOString(),
        ]);

        // Cho phép tiếp tục nếu là admin
        return $next($request);
    }

    /**
     * Handle rate limiting for access attempts
     * Uses configured MAX_ATTEMPTS and DECAY_MINUTES constants
     *
     * @param Request $request
     * @param \App\Models\User|null $user
     * @param string $failureType 'authentication' or 'authorization'
     * @return Response|null
     */
    private function handleRateLimitedAccess(Request $request, ?User $user, string $failureType): ?Response
    {
        $key = self::RATE_LIMIT_KEY_PREFIX . $request->ip();
        if (RateLimiter::tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            Log::warning("Admin middleware: Rate limit exceeded for {$failureType} attempts", [
                'user_id' => $user?->id,
                'user_email' => $user?->email,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'route' => $request->route()?->getName(),
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'timestamp' => now()->toISOString(),
            ]);
            return response("Too many {$failureType} attempts. Please try again later.", 429);
        }
        RateLimiter::hit($key, self::DECAY_MINUTES * 60); // Convert minutes to seconds
        return null;
    }

    /**
     * Clear admin status cache for a specific user
     * Call this when user roles are modified
     *
     * @param int $userId
     * @return bool
     */
    public static function clearAdminStatusCache(int $userId): bool
    {
        return Cache::forget(self::CACHE_KEY_PREFIX . $userId);
    }
}
