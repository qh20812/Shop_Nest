<?php
namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware for enforcing seller role authorization
 *
 * This middleware ensures that only users with the 'Seller' role can access
 * seller-specific routes. It includes enterprise-grade security features:
 * - Role-based access control with caching
 * - Rate limiting to prevent brute force attacks
 * - Comprehensive security logging
 * - Proper response handling for different request types (JSON/AJAX/Inertia vs web)
 *
 * @package App\Http\Middleware
 */
class IsSeller
{
    // Key prefixes
    private const CACHE_KEY_PREFIX = 'user_seller_status_';
    private const RATE_LIMIT_KEY_PREFIX = 'seller_access_';

    /**
     * Handle an incoming request.
     *
     * Checks if the authenticated user has seller privileges. If not authenticated,
     * redirects to login. If authenticated but not a seller, logs the security event
     * and returns appropriate response based on request type.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  Request  $request
     * @return Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If user is not authenticated, return JSON for AJAX/Inertia or redirect to login
        if (!Auth::check()) {
            $rateLimitResponse = $this->handleRateLimitedAccess($request, null, 'authentication');
            if ($rateLimitResponse) {
                return $rateLimitResponse;
            }

            // Log authentication failure
            Log::warning('Seller middleware: Authentication failed', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'route' => $request->route()?->getName(),
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'timestamp' => now()->toISOString(),
            ]);

            if ($this->isJsonRequest($request)) {
                return response()->json(['message' => __('auth.unauthenticated')], 401);
            }

            return redirect()->route('login')->with('error', __('auth.login_required'));
        }

        // Get user and check seller role
        // Cache result for CACHE_TTL_SECONDS to improve performance
        $user = Auth::user();
        $isSellerOrAdmin = Cache::remember(self::CACHE_KEY_PREFIX . $user->id, Config::get('middleware.seller.cache.ttl_seconds'), function () use ($user) {
            return $user->isSeller() || $user->isAdmin();
        });
        if (!$isSellerOrAdmin) {
            $rateLimitResponse = $this->handleRateLimitedAccess($request, $user, 'authorization');
            if ($rateLimitResponse) {
                return $rateLimitResponse;
            }

            // Log authorization failure
            Log::warning('Seller middleware: Authorization failed - User is not seller', [
                'user_id' => $user?->id,
                'user_email' => $user?->email,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'route' => $request->route()?->getName(),
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'timestamp' => now()->toISOString(),
                'user_roles' => $this->getUserRolesForLogging($user),
            ]);

            // Return JSON 403 for AJAX/API/Inertia requests
            if ($this->isJsonRequest($request)) {
                return response()->json(['message' => __('middleware.seller_access_denied')], 403);
            }

            // Web redirect for normal requests
            return redirect()->route('home')->with('error', __('middleware.seller_access_denied'));
        }

        // Log successful seller access
        Log::info('Seller middleware: Access granted', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'route' => $request->route()?->getName(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'timestamp' => now()->toISOString(),
        ]);

        return $next($request);
    }

    /**
     * Handle rate limiting for access attempts
     *
     * Implements rate limiting to prevent brute force attacks on seller routes.
     * Logs when rate limit is exceeded and returns a 429 response.
     *
     * @param Request $request
     * @param \App\Models\User|null $user
     * @param string $failureType 'authentication' or 'authorization'
     * @return Response|null
     */
    private function handleRateLimitedAccess(Request $request, ?User $user, string $failureType): ?Response
    {
        $key = self::RATE_LIMIT_KEY_PREFIX . $request->ip();
        if (RateLimiter::tooManyAttempts($key, Config::get('middleware.seller.rate_limiting.max_attempts'))) {
            Log::warning("Seller middleware: Rate limit exceeded for {$failureType} attempts", [
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
        RateLimiter::hit($key, Config::get('middleware.seller.rate_limiting.decay_minutes') * 60); // Convert minutes to seconds
        return null;
    }

    /**
     * Clear seller status cache for a specific user
     *
     * Call this method when user roles are modified to ensure cache consistency.
     * Should be called after role assignments or removals.
     *
     * @param int $userId
     * @return bool True if cache was cleared, false if key didn't exist
     */
    public static function clearSellerStatusCache(int $userId): bool
    {
        return Cache::forget(self::CACHE_KEY_PREFIX . $userId);
    }

    /**
     * Determine if the request expects a JSON response
     *
     * Checks for JSON/AJAX/Inertia requests to return appropriate response format.
     *
     * @param Request $request
     * @return bool
     */
    private function isJsonRequest(Request $request): bool
    {
        return $request->expectsJson() ||
               ($request->header('Accept') === 'application/json' && !$request->header('X-Inertia'));
    }

    /**
     * Get user roles for logging purposes
     *
     * Safely retrieves user roles without assuming relationship exists.
     *
     * @param User|null $user
     * @return string
     */
    private function getUserRolesForLogging(?User $user): string
    {
        if (!$user) {
            return 'none';
        }

        try {
            // Check if roles relationship exists and is loaded
            if (method_exists($user, 'roles') && $user->relationLoaded('roles')) {
                return $user->roles->pluck('name')->join(', ') ?: 'none';
            }

            // Fallback: check individual role methods
            $roles = [];
            if (method_exists($user, 'isAdmin') && $user->isAdmin()) {
                $roles[] = 'Admin';
            }
            if (method_exists($user, 'isSeller') && $user->isSeller()) {
                $roles[] = 'Seller';
            }
            if (method_exists($user, 'isShipper') && $user->isShipper()) {
                $roles[] = 'Shipper';
            }
            if (method_exists($user, 'isCustomer') && $user->isCustomer()) {
                $roles[] = 'Customer';
            }

            return !empty($roles) ? implode(', ', $roles) : 'none';
        } catch (\Exception $e) {
            return 'unknown';
        }
    }
}