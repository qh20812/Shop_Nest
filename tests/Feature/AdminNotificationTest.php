<?php

namespace Tests\Feature;

use App\Enums\NotificationType;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Notification;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected Role $adminRole;
    protected Role $sellerRole;

    protected function setUp(): void
    {
        parent::setUp();

        app()->setLocale('en');
        config(['app.locale' => 'en']);

        $this->adminRole = Role::factory()->create([
            'name' => ['en' => 'Admin', 'vi' => 'Admin'],
            'description' => ['en' => 'Administrator role', 'vi' => 'Vai trò quản trị'],
        ]);

        $this->sellerRole = Role::factory()->create([
            'name' => ['en' => 'Seller', 'vi' => 'Seller'],
            'description' => ['en' => 'Seller role', 'vi' => 'Vai trò người bán'],
        ]);
    }

    public function test_admin_suspending_shop_creates_notifications(): void
    {
    /** @var User $admin */
    $admin = User::factory()->create();
        $admin->roles()->attach($this->adminRole);

    /** @var User $seller */
    $seller = User::factory()->create([
            'shop_status' => 'active',
            'suspended_until' => null,
        ]);
        $seller->roles()->attach($this->sellerRole);

    $this->actingAs(User::findOrFail($admin->id));

        $response = $this->post(route('admin.shops.suspend', $seller->id), [
            'reason' => 'Policy violation',
            'duration_days' => 7,
        ]);

        $response->assertRedirect();

        $sellerNotification = Notification::where('user_id', $seller->id)->latest('notification_id')->first();
        $this->assertNotNull($sellerNotification, 'Seller did not receive a notification');
        $this->assertSame('Shop Suspension Notice', $sellerNotification->title);
        $this->assertSame(NotificationType::SELLER_ACCOUNT_STATUS, $sellerNotification->type);
        $this->assertStringContainsString('Policy violation', $sellerNotification->content);

        $adminNotification = Notification::where('user_id', $admin->id)->latest('notification_id')->first();
        $this->assertNotNull($adminNotification, 'Admin did not receive a moderation notification');
        $this->assertSame('Shop Suspended', $adminNotification->title);
        $this->assertSame(NotificationType::ADMIN_USER_MODERATION, $adminNotification->type);
        $this->assertStringContainsString($seller->username, $adminNotification->content);
    }

    public function test_admin_deleting_category_creates_notification(): void
    {
    /** @var User $admin */
    $admin = User::factory()->create();
        $admin->roles()->attach($this->adminRole);

        $category = Category::create([
            'name' => ['en' => 'Electronics', 'vi' => 'Điện tử'],
            'description' => ['en' => 'Tech products', 'vi' => 'Sản phẩm công nghệ'],
            'is_active' => true,
        ]);

    $this->actingAs(User::findOrFail($admin->id));

        $response = $this->delete(route('admin.categories.destroy', $category->category_id));
        $response->assertRedirect();

        $notification = Notification::where('user_id', $admin->id)->latest('notification_id')->first();
        $this->assertNotNull($notification, 'Admin did not receive catalog notification');
        $this->assertSame('Category Deleted', $notification->title);
        $this->assertSame(NotificationType::ADMIN_CATALOG_MANAGEMENT, $notification->type);
        $this->assertStringContainsString('Electronics', $notification->content);
    }

    public function test_admin_creating_brand_creates_notification(): void
    {
    /** @var User $admin */
    $admin = User::factory()->create();
        $admin->roles()->attach($this->adminRole);

    $this->actingAs(User::findOrFail($admin->id));

        $response = $this->post(route('admin.brands.store'), [
            'name' => 'Test Brand',
            'description' => 'Description',
        ]);

        $response->assertRedirect(route('admin.brands.index'));

    /** @var Brand $brand */
    $brand = Brand::latest('brand_id')->first();
    $this->assertSame('Test Brand', $brand?->getTranslation('name', 'en'));

        $notification = Notification::where('user_id', $admin->id)->latest('notification_id')->first();
        $this->assertNotNull($notification, 'Admin did not receive brand notification');
        $this->assertSame('Brand Created', $notification->title);
        $this->assertSame(NotificationType::ADMIN_CATALOG_MANAGEMENT, $notification->type);
        $this->assertStringContainsString('Test Brand', $notification->content);
    }

    public function test_admin_creating_category_creates_notification(): void
    {
    /** @var User $admin */
    $admin = User::factory()->create();
        $admin->roles()->attach($this->adminRole);

    $this->actingAs(User::findOrFail($admin->id));

        $response = $this->post(route('admin.categories.store'), [
            'name' => ['en' => 'Test Category', 'vi' => 'Danh mục thử nghiệm'],
            'description' => ['en' => 'Test description', 'vi' => 'Mô tả thử nghiệm'],
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.categories.index'));

        $notification = Notification::where('user_id', $admin->id)->latest('notification_id')->first();
        $this->assertNotNull($notification, 'Admin did not receive category creation notification');
        $this->assertSame('New Category Created', $notification->title);
        $this->assertSame(NotificationType::ADMIN_CATALOG_MANAGEMENT, $notification->type);
        $this->assertStringContainsString('Test Category', $notification->content);
    }

    public function test_admin_updating_category_creates_notification(): void
    {
    /** @var User $admin */
    $admin = User::factory()->create();
        $admin->roles()->attach($this->adminRole);

        $category = Category::create([
            'name' => ['en' => 'Original Category', 'vi' => 'Danh mục gốc'],
            'description' => ['en' => 'Original description', 'vi' => 'Mô tả gốc'],
            'is_active' => true,
        ]);

    $this->actingAs(User::findOrFail($admin->id));

        $response = $this->put(route('admin.categories.update', $category->category_id), [
            'name' => ['en' => 'Updated Category', 'vi' => 'Danh mục cập nhật'],
            'description' => ['en' => 'Updated description', 'vi' => 'Mô tả cập nhật'],
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.categories.index'));

        $notification = Notification::where('user_id', $admin->id)->latest('notification_id')->first();
        $this->assertNotNull($notification, 'Admin did not receive category update notification');
        $this->assertSame('Category Updated', $notification->title);
        $this->assertSame(NotificationType::ADMIN_CATALOG_MANAGEMENT, $notification->type);
        $this->assertStringContainsString('Updated Category', $notification->content);
    }

    public function test_admin_restoring_category_creates_notification(): void
    {
    /** @var User $admin */
    $admin = User::factory()->create();
        $admin->roles()->attach($this->adminRole);

        $category = Category::create([
            'name' => ['en' => 'Restored Category', 'vi' => 'Danh mục khôi phục'],
            'description' => ['en' => 'Restored description', 'vi' => 'Mô tả khôi phục'],
            'is_active' => true,
        ]);
        $category->delete(); // Soft delete first

    $this->actingAs(User::findOrFail($admin->id));

        $response = $this->patch(route('admin.categories.restore', $category->category_id));
        $response->assertRedirect(route('admin.categories.index'));

        $notification = Notification::where('user_id', $admin->id)->latest('notification_id')->first();
        $this->assertNotNull($notification, 'Admin did not receive category restore notification');
        $this->assertSame('Category Restored', $notification->title);
        $this->assertSame(NotificationType::ADMIN_CATALOG_MANAGEMENT, $notification->type);
        $this->assertStringContainsString('Restored Category', $notification->content);
    }
}
