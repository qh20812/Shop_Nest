<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Wishlist;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $activeOrders = [
            'pending' => $user->orders()->where('status', 'pending_confirmation')->count(),
            'delivering' => $user->orders()->where('status', 'delivering')->count(),
            'delivered' => $user->orders()->where('status', 'delivered')->count(),
        ];

        $recentOrders = $user->orders()
            ->with(['items.variant.product'])
            ->latest()
            ->take(5)
            ->get();

        $wishlistCount = $user->wishlists()->count();
        $reviewsCount = $user->reviews()->count();

        return Inertia::render('User/Dashboard/Index', [
            'user'           => $user,
            'activeOrders'   => $activeOrders,
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
            ->with(['items.variant.product'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q) => $q->where('order_number', 'like', "%{$request->search}%"))
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
