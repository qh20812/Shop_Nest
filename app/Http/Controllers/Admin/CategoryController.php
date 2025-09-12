<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * Function: A-101 (CRUD - Read)
     */
    public function index()
    {
        $categories = Category::latest()->paginate(10);
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }
    /**
     * Store a newly created resource in storage.
     * Function: A-101 (CRUD - Create)
     */
    public function store(StoreCategoryRequest $request)
    {
        Category::create($request->validated());
        return redirect()->route('admin.categories.index')->with('success', 'Tạo danh mục thành công.');
    }
    /**
     * Update the specified resource in storage.
     * Function: A-101 (CRUD - Update)
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());
        return redirect()->route('admin.categories.index')->with('success', 'Cập nhật danh mục thành công.');
    }
    /**
     * Remove the specified resource from storage.
     * Function: A-101 (CRUD - Delete)
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('admin.categories.index')->with('success', 'Xóa danh mục thành công.');
    }
}
