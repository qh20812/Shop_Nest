<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Hiển thị danh sách sản phẩm
     */
    public function index()
    {
        $products = Product::with(['category', 'brand', 'seller'])
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Hiển thị form tạo sản phẩm mới
     */
    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::all(),
            'brands' => Brand::all(),
        ]);
    }

    /**
     * Lưu sản phẩm mới vào database
     */
    public function store(StoreProductRequest $request)
    {
        // Gán seller_id là admin đang đăng nhập (hoặc logic khác nếu cần)
        $productData = array_merge($request->validated(), ['seller_id' => Auth::id()]);

        Product::create($productData);

        return redirect()->route('admin.products.index')->with('success', 'Tạo sản phẩm thành công.');
    }

    /**
     * Hiển thị form chỉnh sửa sản phẩm
     */
    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => Category::all(),
            'brands' => Brand::all(),
        ]);
    }

    /**
     * Cập nhật thông tin sản phẩm
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return redirect()->route('admin.products.index')->with('success', 'Cập nhật sản phẩm thành công.');
    }

    /**
     * Xóa sản phẩm (soft delete)
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Xóa sản phẩm thành công.');
    }
}