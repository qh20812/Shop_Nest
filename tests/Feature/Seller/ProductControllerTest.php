<?php


namespace Tests\Feature\Seller;

use App\Enums\ProductStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use App\Services\ImageValidationService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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
            'name_en' => 'Amazing New Product',
            'description' => 'Đây là một sản phẩm rất tốt.',
            'description_en' => 'A fantastic product description.',
            'price' => 199.99,
            'stock' => 100,
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
            'status' => ProductStatus::DRAFT->value,
            'sku' => 'SKU-TEST-001',
            'meta_title' => 'Meta Title',
            'meta_slug' => 'meta-title',
            'meta_description' => 'Meta description content',
        ];

        $response = $this->actingAs($this->sellerOne)->post(route('seller.products.store'), $productData);

        $response->assertRedirect(route('seller.products.index'));
        $response->assertSessionHas('success');

        $product = Product::whereJsonContains('name->vi', 'Sản phẩm tuyệt vời mới')->first();
        $this->assertNotNull($product);
        $this->assertSame($this->sellerOne->id, $product->seller_id);
        $this->assertEquals(ProductStatus::DRAFT, $product->status);
        $this->assertDatabaseHas('products', [
            'product_id' => $product->product_id,
            'meta_slug' => 'meta-title',
        ]);
        $this->assertDatabaseHas('product_variants', [
            'product_id' => $product->product_id,
            'price' => 199.99,
            'stock_quantity' => 100,
            'sku' => 'SKU-TEST-001',
        ]);
    }

    public function test_luu_san_pham_that_bai_voi_du_lieu_khong_hop_le(): void
    {
        $invalidData = [
            'name' => '',
            'price' => -10,
            'variants' => [
                [
                    'price' => -10,
                    'stock_quantity' => -5,
                ]
            ]
        ];

        $response = $this->actingAs($this->sellerOne)->post(route('seller.products.store'), $invalidData);

        $response->assertSessionHasErrors(['name', 'category_id', 'brand_id', 'variants.0.price', 'variants.0.stock_quantity']);
    }

    public function test_seller_creation_handles_images_and_numeric_status(): void
    {
        $this->mock(ImageValidationService::class)
            ->shouldReceive('validateImage')
            ->andReturnTrue();

        Storage::fake('public');

        $sampleImagePath = base_path('public/image/default-product.png');
        $this->assertFileExists($sampleImagePath);
        $imageContents = file_get_contents($sampleImagePath);

        $payload = [
            'name' => 'Loa Bluetooth Mini',
            'name_en' => 'Bluetooth Speaker Mini',
            'description' => 'Mô tả sản phẩm bằng tiếng Việt.',
            'description_en' => 'English description.',
            'price' => 499000,
            'stock' => 12,
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
            'status' => 2, // legacy numeric pending approval
            'sku' => 'SPK-0001',
            'meta_title' => 'Loa Bluetooth Mini',
            'meta_slug' => 'loa-bluetooth-mini',
            'meta_description' => 'Mô tả ngắn cho loa bluetooth.',
            'images' => [
                UploadedFile::fake()->createWithContent('front.png', $imageContents),
                UploadedFile::fake()->createWithContent('side.png', $imageContents),
            ],
        ];

        $response = $this->actingAs($this->sellerOne)->post(route('seller.products.store'), $payload);

        $response->assertRedirect(route('seller.products.index'));

        $product = Product::with(['images', 'variants'])
            ->whereJsonContains('name->vi', 'Loa Bluetooth Mini')
            ->first();

        $this->assertNotNull($product);
        $this->assertSame(ProductStatus::PENDING_APPROVAL, $product->status);
        $this->assertSame('loa-bluetooth-mini', $product->meta_slug);
        $this->assertCount(1, $product->variants);
        $this->assertSame('SPK-0001', $product->variants->first()->sku);

        $this->assertCount(2, $product->images);
        $primary = $product->images->firstWhere('is_primary', true);
        $this->assertNotNull($primary);
        $this->assertSame(0, $primary->display_order);
        $this->assertTrue(Storage::disk('public')->exists($primary->image_url));

        $second = $product->images->firstWhere('display_order', 1);
        $this->assertNotNull($second);
        $this->assertTrue(Storage::disk('public')->exists($second->image_url));
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
            'name_en' => 'Updated product name',
            'price' => 99.99,
            'stock' => 50,
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
            'status' => ProductStatus::PUBLISHED->value,
        ];

        $response = $this->actingAs($this->sellerOne)->put(route('seller.products.update', $this->productOfSellerOne), $updateData);

        $response->assertRedirect(route('seller.products.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('products', [
            'product_id' => $this->productOfSellerOne->product_id,
            'status' => ProductStatus::PUBLISHED->value,
        ]);
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


