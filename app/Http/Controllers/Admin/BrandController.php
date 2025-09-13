<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBrandRequest;
use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::latest()->paginate(10);
        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands
        ]);
    }

    public function store(StoreBrandRequest $request)
    {
        Brand::create($request->validated());
        return redirect()->route('admin.brands.index')->with('success', 'Tạo thương hiệu thành công.');
    }
    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $brand->update($request->validated());
        return redirect()->route('admin.brands.index')->with('success', 'Cập nhật thương hiệu thành công.');
    }
    public function destroy(Brand $brand)
    {
        $brand->delete();
        return redirect()->route('admin.brands.index')->with('success', 'Xóa thương hiệu thành công.');
    }
}
