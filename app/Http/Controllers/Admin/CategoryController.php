<?php

namespace App\Http\Controllers\Admin;

use App\Enums\NotificationType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\ImageValidationService;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
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
     * Build a depth-first list of parent category options.
     *
     * @return array<int, array{category_id:int, name:string, depth:int, is_active:bool}>
     */
    protected function parentCategoryOptions(?Category $exclude = null): array
    {
        $categories = Category::query()
            ->select('category_id', 'name', 'parent_category_id', 'is_active')
            ->get();

        $excluded = [];

        if ($exclude) {
            $excluded = [$exclude->category_id, ...$this->descendantIds($exclude, $categories)];
        }

        $childrenByParent = $categories->groupBy(fn (Category $category) => $category->parent_category_id ?? 0);

        $options = [];

        $walk = function (int $parentId, int $depth) use (&$walk, &$options, $childrenByParent, $excluded) {
            foreach ($childrenByParent->get($parentId, collect()) as $category) {
                if (in_array($category->category_id, $excluded, true)) {
                    continue;
                }

                $options[] = [
                    'category_id' => $category->category_id,
                    'name' => $category->getTranslation('name', app()->getLocale()),
                    'depth' => $depth,
                    'is_active' => (bool) $category->is_active,
                ];

                $walk($category->category_id, $depth + 1);
            }
        };

        $walk(0, 0);

        return $options;
    }

    /**
     * Collect the ids of every descendant of a category.
     *
     * @param  Collection<int, Category>  $categories
     * @return array<int, int>
     */
    protected function descendantIds(Category $category, $categories): array
    {
        $descendants = [];
        $stack = [$category->category_id];

        while ($stack !== []) {
            $parentId = array_pop($stack);

            foreach ($categories->where('parent_category_id', $parentId) as $child) {
                $descendants[] = $child->category_id;
                $stack[] = $child->category_id;
            }
        }

        return $descendants;
    }

    /**
     * Get current actor name for notifications
     */
    protected function getCurrentActor(): string
    {
        return Auth::user()?->username ?? 'System';
    }

    /**
     * Handle image upload with validation and cleanup
     *
     * @return string The storage path
     *
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

        return '/storage/'.$imagePath;
    }

    /**
     * Display a listing of the resource.
     * Function: A-101 (CRUD - Read)
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->get('search', ''));
        $status = (string) $request->get('status', '');

        $baseQuery = Category::query()
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('name->en', 'like', "%{$search}%")
                        ->orWhere('name->vi', 'like', "%{$search}%");
                });
            });

        $statusCounts = [
            'total' => (clone $baseQuery)->count(),
            'active' => (clone $baseQuery)->where('is_active', true)->count(),
            'inactive' => (clone $baseQuery)->where('is_active', false)->count(),
            'trashed' => (clone $baseQuery)->onlyTrashed()->count(),
        ];

        $query = (clone $baseQuery)
            ->with(['parent:category_id,name'])
            ->withCount(['children', 'products'])
            ->when($status === 'trashed', fn (Builder $builder) => $builder->onlyTrashed())
            ->when($status === 'active', fn (Builder $builder) => $builder->where('is_active', true))
            ->when($status === 'inactive', fn (Builder $builder) => $builder->where('is_active', false));

        $categories = $query->latest()->paginate(self::PAGINATION_LIMIT)->withQueryString();

        $categories->getCollection()->transform(function (Category $category) {
            if (
                $category->image_url
                && ! preg_match('/^https?:\/\//i', (string) $category->image_url)
                && ! str_starts_with((string) $category->image_url, '/')
            ) {
                $category->image_url = Storage::url($category->image_url);
            }

            return $category;
        });

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'totalCategories' => $categories->total(),
            'statusCounts' => $statusCounts,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * Function: A-101 (CRUD - Create Form)
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Create', [
            'parentCategories' => $this->parentCategoryOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * Function: A-101 (CRUD - Create)
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
     */
    public function edit(Category $category): Response
    {
        if (
            $category->image_url
            && ! preg_match('/^https?:\/\//i', (string) $category->image_url)
            && ! str_starts_with((string) $category->image_url, '/')
        ) {
            $category->image_url = Storage::url($category->image_url);
        }

        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
            'parentCategories' => $this->parentCategoryOptions($category),
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Function: A-101 (CRUD - Update)
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
     * Activate an inactive category.
     */
    public function activate(Category $category): RedirectResponse
    {
        if ($category->trashed()) {
            abort(404);
        }

        $category->update(['is_active' => true]);

        $actor = $this->getCurrentActor();
        NotificationService::sendToRole(
            'admin',
            'Category Activated',
            sprintf('Category "%s" was activated by %s.', $category->getTranslation('name', app()->getLocale()), $actor),
            NotificationType::ADMIN_CATALOG_MANAGEMENT,
            $category,
            route('admin.categories.index')
        );

        return redirect()->route('admin.categories.index')->with('success', 'Kích hoạt danh mục thành công.');
    }

    /**
     * Restore a soft-deleted category.
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
