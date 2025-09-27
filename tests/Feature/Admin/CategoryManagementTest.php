<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryManagementTest extends TestCase
{
    use RefreshDatabase; // Tự động reset database sau mỗi lần test, đảm bảo môi trường sạch

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

        // 2. Tạo một user Admin
        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->vi', 'Admin')->first());

        // 3. Tạo một user Customer thông thường
        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->vi', 'Customer')->first());
    }

    /**
     * Kịch bản 1: Khách hàng (không phải admin) không thể truy cập trang quản lý danh mục.
     */
    public function test_customer_cannot_access_category_management_page(): void
    {
        $response = $this->actingAs($this->customer)->get(route('admin.categories.index'));

        // Khẳng định: Phải bị chuyển hướng (ví dụ về dashboard) và nhận thông báo lỗi
        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    /**
     * Kịch bản 2: Admin có thể truy cập trang quản lý danh mục.
     */
    public function test_admin_can_access_category_management_page(): void
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
    public function test_admin_can_create_a_new_category(): void
    {
        $categoryData = [
            'name' => 'Điện thoại & Phụ kiện',
            'description' => 'Các loại điện thoại và phụ kiện đi kèm.',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), $categoryData);

        // Khẳng định: Phải chuyển hướng về trang danh sách và có thông báo thành công
        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'Tạo danh mục thành công.');

        // Khẳng định: Dữ liệu đã được lưu chính xác vào database
        $this->assertDatabaseHas('categories', [
            'name' => 'Điện thoại & Phụ kiện',
        ]);
    }

    /**
     * Kịch bản 4: Admin không thể tạo danh mục mới với tên bị bỏ trống.
     */
    public function test_admin_cannot_create_category_with_missing_name(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), [
            'name' => '', // Dữ liệu không hợp lệ
        ]);

        // Khẳng định: Bị lỗi validation cho trường 'name'
        $response->assertSessionHasErrors('name');
    }

    /**
     * Kịch bản 5: Admin có thể cập nhật thông tin một danh mục.
     */
    public function test_admin_can_update_a_category(): void
    {
        $category = Category::factory()->create(['name' => 'Tên Cũ']);

        $updateData = [
            'name' => 'Tên Mới Cập Nhật',
            'description' => 'Mô tả mới.',
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.categories.update', $category), $updateData);

        // Khẳng định: Chuyển hướng thành công
        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'Cập nhật danh mục thành công.');

        // Khẳng định: Dữ liệu trong database đã được cập nhật
        $this->assertDatabaseHas('categories', [
            'category_id' => $category->category_id,
            'name' => 'Tên Mới Cập Nhật',
        ]);
    }

    /**
     * Kịch bản 6: Admin có thể xóa một danh mục (soft delete).
     */
    public function test_admin_can_delete_a_category(): void
    {
        $category = Category::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('admin.categories.destroy', $category));
        
        // Khẳng định: Chuyển hướng thành công
        $response->assertRedirect(route('admin.categories.index'));
        $response->assertSessionHas('success', 'Xóa danh mục thành công.');

        // Khẳng định: Bản ghi đã được đánh dấu là xóa mềm trong database
        $this->assertSoftDeleted('categories', [
            'category_id' => $category->category_id,
        ]);
    }
}