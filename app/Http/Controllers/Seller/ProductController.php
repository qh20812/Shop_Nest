<?php


namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
// use App\Http\Requests\Admin\StoreProductRequest as AdminStoreProductRequest;
// use App\Http\Requests\Admin\UpdateProductRequest as AdminUpdateProductRequest;
use App\Http\Requests\Seller\StoreProductRequest;
use App\Http\Requests\Seller\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Gán ProductPolicy cho controller này.
     * Laravel sẽ tự động gọi các phương thức trong policy tương ứng với các action.
     */
    public function __construct()
    {
        $this->authorizeResource(Product::class, 'product');
    }

    public function index(): Response
    {
        $products = Product::with(['category', 'brand'])
            ->where('seller_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Seller/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Seller/Products/Create', [
            'categories' => Category::all(),
            'brands' => Brand::all(),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $productData = array_merge($request->validated(), ['seller_id' => Auth::id()]);
        Product::create($productData);

        return redirect()->route('seller.products.index')->with('success', 'Tạo sản phẩm thành công.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Seller/Products/Edit', [
            'product' => $product,
            'categories' => Category::all(),
            'brands' => Brand::all(),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());
        return redirect()->route('seller.products.index')->with('success', 'Cập nhật sản phẩm thành công.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();
        return redirect()->route('seller.products.index')->with('success', 'Xóa sản phẩm thành công.');
    }
}


