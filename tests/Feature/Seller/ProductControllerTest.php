<?php


namespace Tests\Feature\Seller;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $sellerOne;
    private User $sellerTwo;
    private User $customer;
    private Product $productOfSellerOne;
    private Category $category;
    private Brand $brand;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Chạy seeder để tạo các vai trò
        $this->seed(RoleSeeder::class);

        // 2. Tạo người dùng với các vai trò khác nhau
        $this->sellerOne = User::factory()->create();
        $this->sellerOne->roles()->attach(Role::where('name->en', 'Seller')->first());

        $this->sellerTwo = User::factory()->create();
        $this->sellerTwo->roles()->attach(Role::where('name->en', 'Seller')->first());

        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());

        // 3. Tạo dữ liệu cần thiết cho sản phẩm
        $this->category = Category::factory()->create();
        $this->brand = Brand::factory()->create();

        // 4. Tạo một sản phẩm thuộc về sellerOne
        $this->productOfSellerOne = Product::factory()->create([
            'seller_id' => $this->sellerOne->id,
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
        ]);
    }

    // --- INDEX ---
    public function test_seller_co_the_xem_danh_sach_san_pham_cua_minh(): void
    {
        // Tạo một sản phẩm của người bán khác, sản phẩm này không được hiển thị
        Product::factory()->create(['seller_id' => $this->sellerTwo->id]);

        $response = $this->actingAs($this->sellerOne)->get(route('seller.products.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Seller/Products/Index')
            ->has('products.data', 1) // Chỉ thấy 1 sản phẩm
            ->where('products.data.0.product_id', $this->productOfSellerOne->product_id)
        );
    }

    public function test_khach_hang_khong_the_truy_cap_trang_san_pham(): void
    {
        $response = $this->get(route('seller.products.index'));
        $response->assertRedirect(route('login'));
    }

    // --- CREATE & STORE ---
    public function test_seller_co_the_xem_form_tao_san_pham(): void
    {
        $response = $this->actingAs($this->sellerOne)->get(route('seller.products.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Seller/Products/Create')
            ->has('categories')
            ->has('brands')
        );
    }

    public function test_seller_co_the_luu_san_pham_moi(): void
    {
        $productData = [
            'name' => 'Sản phẩm tuyệt vời mới',
            'description' => 'Đây là một sản phẩm rất tốt.',
            'price' => 199.99,
            'stock' => 100,
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
        ];

        $response = $this->actingAs($this->sellerOne)->post(route('seller.products.store'), $productData);

        $response->assertRedirect(route('seller.products.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('products', [
            'name' => 'Sản phẩm tuyệt vời mới',
            'seller_id' => $this->sellerOne->id, // Kiểm tra seller_id được gán đúng
        ]);
    }

    public function test_luu_san_pham_that_bai_voi_du_lieu_khong_hop_le(): void
    {
        $invalidData = ['name' => '', 'price' => -10];

        $response = $this->actingAs($this->sellerOne)->post(route('seller.products.store'), $invalidData);

        $response->assertSessionHasErrors(['name', 'price', 'stock', 'category_id', 'brand_id']);
    }

    // --- EDIT & UPDATE ---
    public function test_seller_co_the_xem_form_sua_san_pham_cua_minh(): void
    {
        $response = $this->actingAs($this->sellerOne)->get(route('seller.products.edit', $this->productOfSellerOne));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Seller/Products/Edit')
            ->where('product.product_id', $this->productOfSellerOne->product_id)
        );
    }

    public function test_seller_khong_the_xem_form_sua_san_pham_cua_nguoi_khac(): void
    {
        $response = $this->actingAs($this->sellerTwo)->get(route('seller.products.edit', $this->productOfSellerOne));
        $response->assertStatus(403); // Bị cấm
    }

    public function test_seller_co_the_cap_nhat_san_pham_cua_minh(): void
    {
        $updateData = [
            'name' => 'Tên sản phẩm đã cập nhật',
            'price' => 99.99,
            'stock' => 50,
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
        ];

        $response = $this->actingAs($this->sellerOne)->put(route('seller.products.update', $this->productOfSellerOne), $updateData);

        $response->assertRedirect(route('seller.products.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('products', ['product_id' => $this->productOfSellerOne->product_id, 'name' => 'Tên sản phẩm đã cập nhật']);
    }

    // --- DESTROY ---
    public function test_seller_co_the_xoa_san_pham_cua_minh(): void
    {
        $response = $this->actingAs($this->sellerOne)->delete(route('seller.products.destroy', $this->productOfSellerOne));

        $response->assertRedirect(route('seller.products.index'));
        $response->assertSessionHas('success');
        $this->assertSoftDeleted('products', ['product_id' => $this->productOfSellerOne->product_id]);
    }

    public function test_seller_khong_the_xoa_san_pham_cua_nguoi_khac(): void
    {
        $response = $this->actingAs($this->sellerTwo)->delete(route('seller.products.destroy', $this->productOfSellerOne));

        $response->assertStatus(403);
        $this->assertDatabaseHas('products', ['product_id' => $this->productOfSellerOne->product_id]);
    }
}


