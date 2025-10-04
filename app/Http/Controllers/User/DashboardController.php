<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // 1. Trang Dashboard Chính
    public function index()
    {
        $user = Auth::user();

        $orderStats = [
            'total_orders'      => $user->orders()->count(),
            'pending_orders'    => $user->orders()->where('status', 1)->count(),
            'confirmed_orders'  => $user->orders()->where('status', 2)->count(),
            'delivered_orders'  => $user->orders()->where('status', 4)->count(), // STATUS_DELIVERED = 4
            'cancelled_orders'  => $user->orders()->where('status', 5)->count(), // STATUS_CANCELLED = 5
            'total_spent'       => $user->orders()->where('status', 4)->sum('total_amount'), // trường trong migration
        ];

        $recentOrders = $user->orders()
            ->with(['items.product', 'items.productVariant'])
            ->latest()
            ->take(5)
            ->get();

        $wishlistCount = $user->wishlists()->count();
        $reviewsCount = $user->reviews()->count();

        return Inertia::render('User/Dashboard/Index', [
            'user'           => $user,
            'orderStats'     => $orderStats,
            'recentOrders'   => $recentOrders,
            'wishlistCount'  => $wishlistCount,
            'reviewsCount'   => $reviewsCount,
        ]);
    }

    // 2. Trang Profile
    public function profile()
    {
        $user = Auth::user()->load('addresses');

        return Inertia::render('User/Dashboard/Profile', [
            'user' => $user,
        ]);
    }

    // 3. Danh sách đơn hàng
    public function orders(Request $request)
    {
        $orders = Auth::user()->orders()
            ->with(['items.product', 'items.productVariant'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q) => $q->where('order_id', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('User/Dashboard/Orders', [
            'orders'  => $orders,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    // 4. Danh sách yêu thích
    public function wishlist()
    {
        $wishlistItems = Auth::user()->wishlists()
            ->with(['product.images', 'product.category', 'product.brand'])
            ->latest()
            ->paginate(12);

        return Inertia::render('User/Dashboard/Wishlist', [
            'wishlistItems' => $wishlistItems,
        ]);
    }

    // 5. Reviews đã viết
    public function reviews()
    {
        $reviews = Auth::user()->reviews()
            ->with('product')
            ->latest()
            ->paginate(10);

        return Inertia::render('User/Dashboard/Reviews', [
            'reviews' => $reviews,
        ]);
    }
}