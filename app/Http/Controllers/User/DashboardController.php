<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Order;
use App\Models\Wishlist;
use App\Models\Review;

class DashboardController extends Controller
{
    // 1. Trang Dashboard Chính
    public function index()
    {
        $user = Auth::user();

        $orderStats = [
            'total_orders'      => $user->orders()->count(),// Tất cả đơn hàng
            'pending_orders'    => $user->orders()->where('status', 1)->count(),// Đơn hàng đang chờ
            'confirmed_orders'  => $user->orders()->where('status', 2)->count(),// Đơn hàng đã xác nhận
            'delivered_orders'  => $user->orders()->where('status', 3)->count(),// Đơn hàng đã giao
            'cancelled_orders'  => $user->orders()->where('status', 4)->count(),// Đơn hàng đã hủy
            'total_spent'       => $user->orders()->where('status', 3)->sum('total_price'),// Tổng chi tiêu
        ];

        $recentOrders = $user->orders()// Lấy 5 đơn hàng gần đây nhất
            ->with(['orderItems.product', 'orderItems.productVariant'])
            ->latest()
            ->take(5)
            ->get();

        $wishlistCount = $user->wishlists()->count();// Số sản phẩm trong danh sách yêu thích
        $reviewsCount = $user->reviews()->count();// Số reviews đã viết

        return Inertia::render('User/Dashboard/Index', [
            'user'           => $user,// Thông tin người dùng
            'orderStats'     => $orderStats,// Thống kê đơn hàng
            'recentOrders'   => $recentOrders,// 5 đơn hàng gần đây
            'wishlistCount'  => $wishlistCount,// Số sản phẩm trong danh sách yêu thích
            'reviewsCount'   => $reviewsCount,// Số reviews đã viết
        ]);
    }

    // 2. Trang Profile
    public function profile()
    {
        $user = Auth::user()->load('addresses');// Lấy thông tin người dùng cùng với địa chỉ

        return Inertia::render('User/Dashboard/Profile', [
            'user' => $user,
        ]);// Trả về view profile với dữ liệu người dùng
    }

    // 3. Danh sách đơn hàng
    public function orders(Request $request)
    {
        $orders = Auth::user()->orders()// Lấy đơn hàng của người dùng đã đăng nhập
            ->with(['orderItems.product', 'orderItems.productVariant'])// Eager load sản phẩm và biến thể sản phẩm
            ->when($request->status, fn($q) => $q->where('status', $request->status))// Lọc theo trạng thái nếu có
            ->when($request->search, fn($q) => $q->where('order_id', 'like', "%{$request->search}%"))// Tìm kiếm theo mã đơn hàng nếu có
            ->latest()// Sắp xếp theo mới nhất
            ->paginate(10)// Phân trang 10 đơn hàng mỗi trang
            ->withQueryString();// Giữ nguyên các tham số truy vấn trong phân trang

        return Inertia::render('User/Dashboard/Orders', [
            'orders'  => $orders,// Trả về view đơn hàng với dữ liệu đơn hàng
            'filters' => $request->only(['status', 'search']),// Truyền các bộ lọc hiện tại để giữ trạng thái tìm kiếm
        ]);
    }

    // 4. Danh sách yêu thích
    public function wishlist()
    {
        $wishlistItems = Auth::user()->wishlists()
            ->with(['product.images', 'product.category', 'product.brand'])// Eager load sản phẩm và các quan hệ liên quan
            ->latest()// Sắp xếp theo mới nhất
            ->paginate(12);// Phân trang 12 sản phẩm mỗi trang

        return Inertia::render('User/Dashboard/Wishlist', [
            'wishlistItems' => $wishlistItems,
        ]);// Trả về view danh sách yêu thích với dữ liệu sản phẩm
    }

    // 5. Reviews đã viết
    public function reviews()
    {
        $reviews = Auth::user()->reviews()// Lấy reviews của người dùng đã đăng nhập
            ->with('product')// Eager load sản phẩm liên quan
            ->latest()// Sắp xếp theo mới nhất
            ->paginate(10);// Phân trang 10 reviews mỗi trang

        return Inertia::render('User/Dashboard/Reviews', [
            'reviews' => $reviews,
        ]);// Trả về view danh sách reviews với dữ liệu reviews
    }
}