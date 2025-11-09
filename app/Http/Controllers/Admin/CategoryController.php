<?php

namespace App\Http\Controllers\Admin;

use App\Enums\NotificationType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\ImageValidationService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    protected ImageValidationService $imageValidator;

    private const PAGINATION_LIMIT = 10;
    private const STORAGE_PATH = 'categories';
    private const STORAGE_DISK = 'public';

    public function __construct(ImageValidationService $imageValidator)
    {
        $this->imageValidator = $imageValidator;
    }

    /**
     * Apply filters to the category query
     *
     * @param Builder $query
     * @param Request $request
     * @return Builder
     */
    protected function applyFilters(Builder $query, Request $request): Builder
    {
        // Filter by status
        $status = $request->get('status');
        if ($status === 'trashed') {
            $query->onlyTrashed();
        } elseif ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        // Add search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->get('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('name->en', 'like', "%{$searchTerm}%")
                  ->orWhere('name->vi', 'like', "%{$searchTerm}%");
            });
        }

        return $query;
    }

    /**
     * Get current actor name for notifications
     *
     * @return string
     */
    protected function getCurrentActor(): string
    {
        return Auth::user()?->username ?? 'System';
    }

    /**
     * Handle image upload with validation and cleanup
     *
     * @param UploadedFile $file
     * @param string|null $oldImageUrl
     * @return string The storage path
     * @throws \Exception
     */
    protected function handleImageUpload(UploadedFile $file, ?string $oldImageUrl = null): string
    {
        // Validate image for category type
        $this->imageValidator->validateImage($file, ImageValidationService::TYPE_CATEGORY);

        // Delete old image if exists
        if ($oldImageUrl) {
            Storage::disk(self::STORAGE_DISK)->delete(str_replace('/storage/', '', $oldImageUrl));
        }

        // Store the validated image
        $imagePath = $file->store(self::STORAGE_PATH, self::STORAGE_DISK);

        return '/storage/' . $imagePath;
    }
    /**
     * Display a listing of the resource.
     * Function: A-101 (CRUD - Read)
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $query = Category::latest();

        // Apply filters using the reusable method
        $query = $this->applyFilters($query, $request);

        // Get paginated results and total count from the same query
        $categories = $query->paginate(self::PAGINATION_LIMIT);

        // Calculate total from the base query (without pagination)
        $totalQuery = clone $query;
        $totalCategories = $totalQuery->count();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'totalCategories' => $totalCategories,
            'filters' => [
                'search' => $request->get('search'),
                'status' => $request->get('status'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Function: A-101 (CRUD - Create Form)
     *
     * @return Response
     */
    public function create(): Response
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
     *
     * @param StoreCategoryRequest $request
     * @return RedirectResponse
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        // Handle file upload with validation
        if ($request->hasFile('image')) {
            $validatedData['image_url'] = $this->handleImageUpload($request->file('image'));
        }

        $category = Category::create($validatedData);

        $actor = $this->getCurrentActor();
        NotificationService::sendToRole(
            'admin',
            'New Category Created',
            sprintf('Category "%s" was created by %s.', $category->getTranslation('name', app()->getLocale()), $actor),
            NotificationType::ADMIN_CATALOG_MANAGEMENT,
            $category,
            route('admin.categories.index')
        );

        return redirect()->route('admin.categories.index')->with('success', 'Tạo danh mục thành công.');
    }

    /**
     * Show the form for editing the specified resource.
     * Function: A-101 (CRUD - Edit Form)
     *
     * @param Category $category
     * @return Response
     */
    public function edit(Category $category): Response
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
     *
     * @param UpdateCategoryRequest $request
     * @param Category $category
     * @return RedirectResponse
     */
    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        $validatedData = $request->validated();

        // Handle file upload with validation
        if ($request->hasFile('image')) {
            $validatedData['image_url'] = $this->handleImageUpload(
                $request->file('image'),
                $category->image_url
            );
        }

        $category->update($validatedData);

        $actor = $this->getCurrentActor();
        NotificationService::sendToRole(
            'admin',
            'Category Updated',
            sprintf('Category "%s" was updated by %s.', $category->getTranslation('name', app()->getLocale()), $actor),
            NotificationType::ADMIN_CATALOG_MANAGEMENT,
            $category,
            route('admin.categories.index')
        );

        return redirect()->route('admin.categories.index')->with('success', 'Cập nhật danh mục thành công.');
    }
    public function destroy(Category $category): RedirectResponse
    {
        $categoryName = $category->getTranslation('name', app()->getLocale());
        $actor = $this->getCurrentActor();

        $category->delete();

        NotificationService::sendToRole(
            'admin',
            'Category Deleted',
            sprintf('Category "%s" was deleted by %s.', $categoryName, $actor),
            NotificationType::ADMIN_CATALOG_MANAGEMENT,
            $category,
            route('admin.categories.index')
        );
        return redirect()->route('admin.categories.index')->with('success', 'Ẩn danh mục thành công.');
    }

    /**
     * Restore a soft-deleted category.
     *
     * @param int $id
     * @return RedirectResponse
     */
    public function restore(int $id): RedirectResponse
    {
        $category = Category::withTrashed()->findOrFail($id);
        $category->restore();
        
        $actor = $this->getCurrentActor();
        NotificationService::sendToRole(
            'admin',
            'Category Restored',
            sprintf('Category "%s" was restored by %s.', $category->getTranslation('name', app()->getLocale()), $actor),
            NotificationType::ADMIN_CATALOG_MANAGEMENT,
            $category,
            route('admin.categories.index')
        );
        
        return redirect()->route('admin.categories.index')->with('success', 'Khôi phục danh mục thành công.');
    }

    /**
     * Permanently delete a category.
     *
     * @param int $id
     * @return RedirectResponse
     */
    public function forceDelete(int $id): RedirectResponse
    {
        $category = Category::withTrashed()->findOrFail($id);
        $categoryName = $category->getTranslation('name', app()->getLocale());
        $actor = $this->getCurrentActor();

        NotificationService::sendToRole(
            'admin',
            'Category Permanently Deleted',
            sprintf('Category "%s" was permanently deleted by %s.', $categoryName, $actor),
            NotificationType::ADMIN_CATALOG_MANAGEMENT,
            $category,
            route('admin.categories.index')
        );

        $category->forceDelete();
        
        return redirect()->route('admin.categories.index')->with('success', 'Xóa vĩnh viễn danh mục thành công.');
    }
}
