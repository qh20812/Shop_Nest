<?php

namespace Tests\Feature\Admin;

use App\Enums\NotificationType;
use App\Models\Category;
use App\Models\Notification;
use App\Models\Role;
use App\Models\User;
use App\Services\ImageValidationService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CategoryManagementTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected User $customer;

    /**
     * Hàm này sẽ chạy trước mỗi bài test
     */
    protected function setUp(): void
    {
        parent::setUp();

        // 1. Chạy seed để tạo các Role
        $this->seed(RoleSeeder::class);
        app()->setLocale('en'); // Set locale to English for consistent testing

        // 2. Tạo một user Admin
        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        // 3. Tạo một user Customer thông thường
        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());
    }

    /**
     * Kịch bản 1: Khách hàng (không phải admin) không thể truy cập trang quản lý danh mục.
     */
    public function test_khach_hang_khong_the_truy_cap_trang_quan_ly_danh_muc(): void
    {
        $response = $this->actingAs($this->customer)->get(route('admin.categories.index'));

        // Khẳng định: Phải bị chuyển hướng (ví dụ về dashboard) và nhận thông báo lỗi
        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error');
    }

    /**
     * Kịch bản 2: Admin có thể truy cập trang quản lý danh mục.
     */
    public function test_admin_co_the_truy_cap_trang_quan_ly_danh_muc(): void
    {
        // Tạo một vài danh mục mẫu
        Category::factory(3)->create();

        $response = $this->actingAs($this->admin)->get(route('admin.categories.index'));

        // Khẳng định: Truy cập thành công và thấy được component Inertia tương ứng
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Categories/Index')
                                                    ->has('categories.data', 3) // Kiểm tra có đúng 3 danh mục được trả về không
        );
    }

    /**
     * Kịch bản 3: Admin có thể tạo một danh mục mới với dữ liệu hợp lệ.
     */
    public function test_admin_co_the_tao_danh_muc_moi_voi_du_lieu_hop_le(): void
    {
        $categoryData = [
            'name' => [
                'en' => 'Phones & Accessories',
                'vi' => 'Điện thoại & Phụ kiện'
            ],
            'description' => [
                'en' => 'Various types of phones and accessories.',
                'vi' => 'Các loại điện thoại và phụ kiện đi kèm.'
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), $categoryData);

        // Khẳng định: Phải chuyển hướng về trang danh sách và có thông báo thành công
        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'Tạo danh mục thành công.');

        // Khẳng định: Dữ liệu đã được lưu chính xác vào database
        $this->assertDatabaseHas('categories', [
            'name->vi' => 'Điện thoại & Phụ kiện',
        ]);
    }

    /**
     * Kịch bản 4: Admin không thể tạo danh mục mới với tên bị bỏ trống.
     */
    public function test_admin_khong_the_tao_danh_muc_voi_ten_trong(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), [
            'name' => ['en' => '', 'vi' => ''], // Dữ liệu không hợp lệ
            'is_active' => true,
        ]);

        // Khẳng định: Bị lỗi validation cho trường 'name'
        $response->assertSessionHasErrors(['name.en', 'name.vi']);
    }

    /**
     * Kịch bản 5: Admin có thể cập nhật thông tin một danh mục.
     */
    public function test_admin_co_the_cap_nhat_thong_tin_danh_muc(): void
    {
        $category = Category::factory()->create([
            'name' => ['en' => 'Old Name', 'vi' => 'Tên Cũ']
        ]);

        $updateData = [
            'name' => [
                'en' => 'Updated New Name',
                'vi' => 'Tên Mới Cập Nhật'
            ],
            'description' => [
                'en' => 'New description.',
                'vi' => 'Mô tả mới.'
            ],
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.categories.update', $category), $updateData);

        // Khẳng định: Chuyển hướng thành công
        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'Cập nhật danh mục thành công.');

        // Khẳng định: Dữ liệu trong database đã được cập nhật
        $this->assertDatabaseHas('categories', [
            'category_id' => $category->category_id,
            'name->vi' => 'Tên Mới Cập Nhật',
        ]);
    }

    /**
     * Kịch bản 6: Admin có thể xóa một danh mục (soft delete).
     */
    public function test_admin_co_the_xoa_danh_muc(): void
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('admin.categories.destroy', $category));
        
        // Khẳng định: Chuyển hướng thành công
        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'Ẩn danh mục thành công.');

        // Khẳng định: Bản ghi đã được đánh dấu là xóa mềm trong database
        $this->assertSoftDeleted('categories', [
            'category_id' => $category->category_id,
        ]);
    }

    public function test_admin_can_access_create_category_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.categories.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Admin/Categories/Create'));
    }

    public function test_admin_can_access_edit_category_page(): void
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.categories.edit', $category));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Admin/Categories/Edit'));
    }

    /**
     * @requires extension gd
     */
    public function test_admin_can_create_category_with_image(): void
    {
        Storage::fake('public');

        // Create a valid image for category (minimum 400x400 pixels as per ImageValidationService)
        $image = UploadedFile::fake()->image('category.jpg', 400, 400);
        $categoryData = [
            'name' => [
                'en' => 'Electronics',
                'vi' => 'Điện tử'
            ],
            'description' => [
                'en' => 'Electronic devices',
                'vi' => 'Thiết bị điện tử'
            ],
            'is_active' => true,
            'image' => $image,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), $categoryData);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('categories', [
            'name->en' => 'Electronics',
        ]);
        Storage::assertExists('categories/' . $image->hashName());
    }

    public function test_admin_can_update_category(): void
    {
        $category = Category::factory()->create([
            'name' => ['en' => 'Old Category', 'vi' => 'Danh mục cũ']
        ]);
        $updateData = [
            'name' => [
                'en' => 'Updated Category',
                'vi' => 'Danh mục cập nhật'
            ],
            'description' => [
                'en' => 'Updated description',
                'vi' => 'Mô tả cập nhật'
            ],
            'is_active' => false,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.categories.update', $category), $updateData);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('categories', [
            'category_id' => $category->category_id,
            'name->en' => 'Updated Category',
            'is_active' => false,
        ]);
    }

    public function test_admin_can_restore_category(): void
    {
        $category = Category::factory()->create();
        $category->delete();

        $response = $this->actingAs($this->admin)->patch(route('admin.categories.restore', $category->category_id));

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('categories', [
            'category_id' => $category->category_id,
            'deleted_at' => null,
        ]);
    }

    public function test_admin_can_force_delete_category(): void
    {
        $category = Category::factory()->create();
        $category->delete();

        $response = $this->actingAs($this->admin)->delete(route('admin.categories.forceDelete', $category->category_id));

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('categories', [
            'category_id' => $category->category_id,
        ]);
    }

    public function test_admin_can_filter_categories_by_search(): void
    {
        Category::factory()->create(['name' => ['en' => 'Phones', 'vi' => 'Điện thoại']]);
        Category::factory()->create(['name' => ['en' => 'Laptops', 'vi' => 'Máy tính xách tay']]);

        $response = $this->actingAs($this->admin)->get(route('admin.categories.index', ['search' => 'Phones']));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->has('categories.data', 1)
            ->where('categories.data.0.name.en', 'Phones')
        );
    }

    public function test_admin_can_filter_categories_by_status(): void
    {
        Category::factory()->create(['is_active' => true]);
        Category::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->admin)->get(route('admin.categories.index', ['status' => 'active']));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->has('categories.data', 1));
    }

    public function test_customer_cannot_access_category_management(): void
    {
        $response = $this->actingAs($this->customer)->get(route('admin.categories.index'));

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error');
    }

    public function test_validation_errors_on_create_category(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), []);

        $response->assertSessionHasErrors(['name.en', 'name.vi', 'is_active']);
    }

    public function test_validation_errors_on_update_category(): void
    {
        $category = Category::factory()->create();
        $response = $this->actingAs($this->admin)->put(route('admin.categories.update', $category), [
            'name' => ['en' => '', 'vi' => ''],
        ]);

        $response->assertSessionHasErrors(['name.en', 'name.vi']);
    }

    public function test_category_translations_are_handled_in_index(): void
    {
        Category::factory()->create(['name' => ['en' => 'Test Category', 'vi' => 'Danh mục thử']]);

        $response = $this->actingAs($this->admin)->get(route('admin.categories.index'));

        $response->assertInertia(fn($page) => $page
            ->has('categories.data', 1)
            ->where('categories.data.0.name.en', 'Test Category')
        );
    }

    /**
     * @requires extension gd
     */
    public function test_admin_can_create_category_with_invalid_image(): void
    {
        Storage::fake('public');

        // Create an invalid image (too small for category requirements)
        $image = UploadedFile::fake()->image('category.jpg', 100, 100);
        $categoryData = [
            'name' => [
                'en' => 'Electronics',
                'vi' => 'Điện tử'
            ],
            'is_active' => true,
            'image' => $image,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), $categoryData);

        $response->assertSessionHasErrors(['image']);
    }

    /**
     * @requires extension gd
     */
    public function test_admin_can_update_category_with_image(): void
    {
        Storage::fake('public');

        $category = Category::factory()->create();
        $image = UploadedFile::fake()->image('category.jpg', 400, 400);

        $updateData = [
            'name' => [
                'en' => 'Updated Electronics',
                'vi' => 'Điện tử cập nhật'
            ],
            'is_active' => true,
            'image' => $image,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.categories.update', $category), $updateData);

        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success');
        Storage::assertExists('categories/' . $image->hashName());
    }

    public function test_notification_is_sent_when_category_is_created(): void
    {
        $categoryData = [
            'name' => [
                'en' => 'Test Category',
                'vi' => 'Danh mục thử'
            ],
            'is_active' => true,
        ];

        $this->actingAs($this->admin)->post(route('admin.categories.store'), $categoryData);

        $this->assertDatabaseHas('notifications', [
            'title' => 'New Category Created',
            'type' => NotificationType::ADMIN_CATALOG_MANAGEMENT,
        ]);
    }

    public function test_notification_is_sent_when_category_is_updated(): void
    {
        $category = Category::factory()->create();

        $updateData = [
            'name' => [
                'en' => 'Updated Category',
                'vi' => 'Danh mục cập nhật'
            ],
            'is_active' => true,
        ];

        $this->actingAs($this->admin)->put(route('admin.categories.update', $category), $updateData);

        $this->assertDatabaseHas('notifications', [
            'title' => 'Category Updated',
            'type' => NotificationType::ADMIN_CATALOG_MANAGEMENT,
        ]);
    }

    public function test_notification_is_sent_when_category_is_deleted(): void
    {
        $category = Category::factory()->create();

        $this->actingAs($this->admin)->delete(route('admin.categories.destroy', $category));

        $this->assertDatabaseHas('notifications', [
            'title' => 'Category Deleted',
            'type' => NotificationType::ADMIN_CATALOG_MANAGEMENT,
        ]);
    }

    public function test_notification_is_sent_when_category_is_restored(): void
    {
        $category = Category::factory()->create();
        $category->delete();

        $this->actingAs($this->admin)->patch(route('admin.categories.restore', $category->category_id));

        $this->assertDatabaseHas('notifications', [
            'title' => 'Category Restored',
            'type' => NotificationType::ADMIN_CATALOG_MANAGEMENT,
        ]);
    }

    public function test_notification_is_sent_when_category_is_force_deleted(): void
    {
        $category = Category::factory()->create();
        $category->delete();

        $this->actingAs($this->admin)->delete(route('admin.categories.forceDelete', $category->category_id));

        $this->assertDatabaseHas('notifications', [
            'title' => 'Category Permanently Deleted',
            'type' => NotificationType::ADMIN_CATALOG_MANAGEMENT,
        ]);
    }

    public function test_filter_logic_returns_correct_results(): void
    {
        // Create test categories with unique names
        Category::factory()->create(['name' => ['en' => 'Active Electronics', 'vi' => 'Điện tử hoạt động'], 'is_active' => true]);
        Category::factory()->create(['name' => ['en' => 'Inactive Books', 'vi' => 'Sách không hoạt động'], 'is_active' => false]);
        $trashedCategory = Category::factory()->create(['name' => ['en' => 'Trashed Clothes', 'vi' => 'Quần áo đã xóa']]);
        $trashedCategory->delete();

        // Test active filter
        $response = $this->actingAs($this->admin)->get(route('admin.categories.index', ['status' => 'active']));
        $response->assertInertia(fn($page) => $page->has('categories.data', 1));

        // Test inactive filter
        $response = $this->actingAs($this->admin)->get(route('admin.categories.index', ['status' => 'inactive']));
        $response->assertInertia(fn($page) => $page->has('categories.data', 1));

        // Test trashed filter
        $response = $this->actingAs($this->admin)->get(route('admin.categories.index', ['status' => 'trashed']));
        $response->assertInertia(fn($page) => $page->has('categories.data', 1));

        // Test search filter - search for unique term
        $response = $this->actingAs($this->admin)->get(route('admin.categories.index', ['search' => 'Electronics']));
        $response->assertInertia(fn($page) => $page->has('categories.data', 1));
    }
}