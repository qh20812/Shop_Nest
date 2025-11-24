<?php

namespace App\Http\Controllers\Admin;

use App\Enums\NotificationType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBrandRequest;
use App\Http\Requests\Admin\UpdateBrandRequest;
use App\Models\Brand;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $query = Brand::query();
        $totalBrands = Brand::count();

        // Filter by status
        if ($request->status === 'inactive') {
            $query->onlyTrashed();
        } else {
            $query->whereNull('deleted_at');
        }

        // Filter by search
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $brands = $query->withCount('products')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Transform brands to resolve translations
        $transformedBrands = $brands->getCollection()->map(function ($brand) {
            return [
                'brand_id' => $brand->brand_id,
                'name' => $brand->getTranslation('name', app()->getLocale()),
                'description' => $brand->description,
                'logo_url' => $brand->logo_url ? (preg_match('/^https?:\/\//i', $brand->logo_url) ? $brand->logo_url : Storage::url($brand->logo_url)) : null,
                'is_active' => $brand->is_active,
                'deleted_at' => $brand->deleted_at,
                'products_count' => $brand->products_count,
                'created_at' => $brand->created_at,
            ];
        });
        $brands->setCollection($transformedBrands);

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
            'totalBrands' => $totalBrands,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Brands/Create');
    }

    public function store(StoreBrandRequest $request)
    {
        $data = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $data['logo_url'] = $request->file('logo')->store('brands/logos', 'public');
        }

        $brand = Brand::create($data);

        $actor = Auth::user()?->username ?? 'System';
        NotificationService::sendToRole(
            'admin',
            'Brand Created',
            sprintf('Brand "%s" was created by %s.', $brand->name, $actor),
            NotificationType::ADMIN_CATALOG_MANAGEMENT,
            $brand,
            route('admin.brands.index')
        );
        return redirect()->route('admin.brands.index')->with('success', 'Brand created successfully.');
    }

    public function edit($id)
    {
        $brand = Brand::findOrFail($id);
        return Inertia::render('Admin/Brands/Edit', [
            'brand' => $brand
        ]);
    }
    
    public function update(UpdateBrandRequest $request, $id)
    {
        $brand = Brand::findOrFail($id);
        $data = $request->validated();

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($brand->logo_url) {
                Storage::disk('public')->delete($brand->logo_url);
            }
            $data['logo_url'] = $request->file('logo')->store('brands/logos', 'public');
        }

        $brand->update($data);
        return redirect()->route('admin.brands.index')->with('success', 'Brand updated successfully.');
    }

    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);
        $actor = Auth::user()?->username ?? 'System';
        $brandName = $brand->name;

        NotificationService::sendToRole(
            'admin',
            'Brand Deactivated',
            sprintf('Brand "%s" was deactivated by %s.', $brandName, $actor),
            NotificationType::ADMIN_CATALOG_MANAGEMENT,
            $brand,
            route('admin.brands.index')
        );

        $brand->delete();
        return redirect()->route('admin.brands.index')->with('success', 'Brand deactivated successfully.');
    }

    public function restore($id)
    {
        $brand = Brand::withTrashed()->findOrFail($id);
        $brand->restore();

        $actor = Auth::user()?->username ?? 'System';
        NotificationService::sendToRole(
            'admin',
            'Brand Restored',
            sprintf('Brand "%s" was restored by %s.', $brand->name, $actor),
            NotificationType::ADMIN_CATALOG_MANAGEMENT,
            $brand,
            route('admin.brands.index')
        );
        return redirect()->route('admin.brands.index')->with('success', 'Brand restored successfully.');
    }
}
