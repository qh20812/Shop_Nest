<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * Function: A-101 (CRUD - Read)
     */
    public function index(Request $request)
    {
        $query = Category::latest();
        
        // Filter by status (active or trashed)
        if ($request->get('status') === 'trashed') {
            $query->onlyTrashed();
        }
        
        // Add search functionality if search parameter exists
        if ($request->filled('search')) {
            $searchTerm = $request->get('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('name->en', 'like', "%{$searchTerm}%")
                  ->orWhere('name->vi', 'like', "%{$searchTerm}%");
            });
        }
        
        $categories = $query->paginate(10);
        
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => [
                'search' => $request->get('search'),
                'status' => $request->get('status'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Function: A-101 (CRUD - Create Form)
     */
    public function create()
    {
        $parentCategories = Category::whereNull('parent_category_id')
            ->where('is_active', true)
            ->get();
        
        return Inertia::render('Admin/Categories/Create', [
            'parentCategories' => $parentCategories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * Function: A-101 (CRUD - Create)
     */
    public function store(StoreCategoryRequest $request)
    {
        $validatedData = $request->validated();
        
        // Handle file upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('categories', 'public');
            $validatedData['image_url'] = '/storage/' . $imagePath;
        }
        
        Category::create($validatedData);
        return redirect()->route('admin.categories.index')->with('success', 'Tạo danh mục thành công.');
    }

    /**
     * Show the form for editing the specified resource.
     * Function: A-101 (CRUD - Edit Form)
     */
    public function edit(Category $category)
    {
        $parentCategories = Category::whereNull('parent_category_id')
            ->where('is_active', true)
            ->where('category_id', '!=', $category->category_id)
            ->get();
        
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
            'parentCategories' => $parentCategories
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Function: A-101 (CRUD - Update)
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $validatedData = $request->validated();
        
        // Handle file upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($category->image_url && file_exists(public_path($category->image_url))) {
                unlink(public_path($category->image_url));
            }
            
            $imagePath = $request->file('image')->store('categories', 'public');
            $validatedData['image_url'] = '/storage/' . $imagePath;
        }
        
        $category->update($validatedData);
        return redirect()->route('admin.categories.index')->with('success', 'Cập nhật danh mục thành công.');
    }
    /**
     * Remove the specified resource from storage (Soft Delete).
     * Function: A-101 (CRUD - Delete)
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('admin.categories.index')->with('success', 'Ẩn danh mục thành công.');
    }

    /**
     * Restore a soft-deleted category.
     */
    public function restore($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->restore();
        
        return redirect()->route('admin.categories.index')->with('success', 'Khôi phục danh mục thành công.');
    }

    /**
     * Permanently delete a category.
     */
    public function forceDelete($id)
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->forceDelete();
        
        return redirect()->route('admin.categories.index')->with('success', 'Xóa vĩnh viễn danh mục thành công.');
    }
}
