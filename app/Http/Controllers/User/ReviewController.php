<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Danh sách review của user hiện tại
     */
    public function index()
    {
        $user = Auth::user();
        $reviews = Review::with('product')
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    /**
     * Form tạo review (API: trả về order + product để kiểm tra)
     */
    public function create($orderId, $productId)
    {
        $user = Auth::user();

        // Kiểm tra order thuộc về user
        $order = Order::where('order_id', $orderId)
            ->where('customer_id', $user->id)
            ->firstOrFail();

        // Kiểm tra product có tồn tại
        $product = Product::findOrFail($productId);

        // Kiểm tra product có nằm trong order không
        $orderHasProduct = $order->items()->where('variant_id', $product->variants->pluck('variant_id'))->exists();
        if (!$orderHasProduct) {
            return response()->json([
                'message' => 'Bạn không thể review sản phẩm không có trong order này.'
            ], 403);
        }

        return response()->json([
            'order' => $order,
            'product' => $product,
        ]);
    }

    /**
     * Lưu review mới
     */
    public function store(Request $request, $productId)
    {
        $user = Auth::user();

        $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:2000',
        ]);

        $product = Product::findOrFail($productId);

        // Check user đã review sản phẩm này chưa
        $existing = Review::where('product_id', $productId)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Bạn đã review sản phẩm này rồi.'
            ], 400);
        }

        $review = Review::create([
            'product_id' => $productId,
            'user_id'    => $user->id,
            'rating'     => $request->rating,
            'comment'    => $request->comment,
            'is_approved'=> false, // pending
        ]);

        return response()->json([
            'message' => 'Review đã được gửi thành công (chờ admin duyệt).',
            'review'  => $review,
        ], 201);
    }

    /**
     * Xem chi tiết review
     */
    public function show($id)
    {
        $user = Auth::user();
        $review = Review::with('product')
            ->where('review_id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return response()->json($review);
    }
}
