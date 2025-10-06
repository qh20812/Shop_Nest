<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Review;

class ProductController extends Controller
{
    // 1. Danh sách sản phẩm, lọc, tìm kiếm, phân trang
    public function index(Request $request)
    {
        $query = Product::query()->with(['images', 'category', 'brand', 'variants']);

        // Lọc theo danh mục
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Lọc theo thương hiệu
        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        // Lọc theo giá
        if ($request->filled('price_min')) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('price', '>=', $request->price_min);
            });
        }
        if ($request->filled('price_max')) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('price', '<=', $request->price_max);
            });
        }

        // Tìm kiếm theo tên hoặc mô tả
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name->vi', 'like', "%$search%")
                  ->orWhere('name->en', 'like', "%$search%")
                  ->orWhere('description->vi', 'like', "%$search%")
                  ->orWhere('description->en', 'like', "%$search%");
            });
        }

        // Sắp xếp
        switch ($request->input('sort')) {
            case 'price_asc':
                $query->orderByRaw('(SELECT MIN(price) FROM product_variants WHERE product_id = products.product_id) ASC');
                break;
            case 'price_desc':
                $query->orderByRaw('(SELECT MAX(price) FROM product_variants WHERE product_id = products.product_id) DESC');
                break;
            case 'latest':
                $query->latest();
                break;
            case 'best_selling':
                $query->orderByDesc('sold_count');
                break;
            case 'top_rated':
                $query->orderByDesc('average_rating');
                break;
            default:
                $query->latest();
        }

        $products = $query->paginate(20)->withQueryString();

        return Inertia::render('Product/Index', [
            'products' => $products,
            'filters' => $request->all(),
        ]);
    }

    // 2. Chi tiết sản phẩm
    public function show($productId)
    {
        $product = Product::with([
            'images',
            'category',
            'brand',
            'variants',
            'reviews.user',
        ])->findOrFail($productId);

        // Tính điểm trung bình đánh giá
        $averageRating = $product->reviews()->avg('rating');

        // Khuyến mãi, voucher, tồn kho, v.v. (giả sử có các quan hệ hoặc logic riêng)
        // $promotions = $product->promotions;
        // $stock = $product->variants->sum('stock_quantity');

        return Inertia::render('Product/Show', [
            'product' => $product,
            'averageRating' => $averageRating,
            // 'promotions' => $promotions,
            // 'stock' => $stock,
        ]);
    }

    // 3. Xem nhanh sản phẩm (Quick View)
    public function quickView($productId)
    {
        $product = Product::with(['images', 'variants'])->findOrFail($productId);

        return response()->json([
            'product' => $product,
        ]);
    }

    // 4. Sản phẩm liên quan
    public function getRelated($productId)
    {
        $product = Product::findOrFail($productId);

        $related = Product::where('product_id', '!=', $productId)
            ->where(function ($q) use ($product) {
                $q->where('category_id', $product->category_id)
                  ->orWhere('brand_id', $product->brand_id);
            })
            ->with(['images'])
            ->take(8)
            ->get();

        return response()->json([
            'related' => $related,
        ]);
    }

    // 5. Lấy đánh giá sản phẩm
    public function getReviews($productId)
    {
        $reviews = Review::where('product_id', $productId)
            ->with('user')
            ->orderByDesc('created_at')
            ->paginate(10);

        $averageRating = Review::where('product_id', $productId)->avg('rating');

        return response()->json([
            'reviews' => $reviews,
            'averageRating' => $averageRating,
        ]);
    }
}
