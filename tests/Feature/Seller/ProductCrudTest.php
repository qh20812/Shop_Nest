<?php

namespace Tests\Feature\Seller;

use App\Enums\ProductStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProductCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $seller;

    private User $otherSeller;

    private Category $category;

    private Brand $brand;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
        Notification::fake();

        $this->seed(RoleSeeder::class);

        $this->seller = User::factory()->create();
        $this->seller->roles()->attach(Role::where('name->en', 'Seller')->first());

        $this->otherSeller = User::factory()->create();
        $this->otherSeller->roles()->attach(Role::where('name->en', 'Seller')->first());

        $this->category = Category::factory()->create();
        $this->brand = Brand::factory()->create();
    }

    public function test_update_without_variants_key_preserves_existing_variants(): void
    {
        $product = $this->productFor($this->seller);
        $primary = $this->variantFor($product, [
            'sku' => 'KEEP-A',
            'stock_quantity' => 7,
            'is_primary' => true,
        ]);
        $secondary = $this->variantFor($product, [
            'sku' => 'KEEP-B',
            'stock_quantity' => 3,
            'is_primary' => false,
        ]);

        $response = $this->actingAs($this->seller)->put(
            route('seller.products.update', $product),
            $this->updatePayload()
        );

        $response->assertRedirect(route('seller.products.index'));
        $response->assertSessionHasNoErrors();

        $this->assertSame(2, ProductVariant::where('product_id', $product->product_id)->count());
        $this->assertDatabaseHas('product_variants', [
            'variant_id' => $primary->variant_id,
            'sku' => 'KEEP-A',
            'stock_quantity' => 7,
        ]);
        $this->assertDatabaseHas('product_variants', [
            'variant_id' => $secondary->variant_id,
            'sku' => 'KEEP-B',
            'stock_quantity' => 3,
        ]);
    }

    public function test_update_can_add_change_and_remove_variants(): void
    {
        $product = $this->productFor($this->seller);

        $red = $this->variantFor($product, [
            'variant_name' => 'Red',
            'sku' => 'SYNC-RED',
            'price' => 100,
            'stock_quantity' => 5,
            'option_values' => [['name' => 'Color', 'value' => 'Red']],
            'option_signature' => 'color:red',
            'is_primary' => true,
        ]);
        $blue = $this->variantFor($product, [
            'variant_name' => 'Blue',
            'sku' => 'SYNC-BLUE',
            'price' => 110,
            'stock_quantity' => 9,
            'option_values' => [['name' => 'Color', 'value' => 'Blue']],
            'option_signature' => 'color:blue',
            'is_primary' => false,
        ]);

        $response = $this->actingAs($this->seller)->put(
            route('seller.products.update', $product),
            $this->updatePayload([
                'variants' => [
                    [
                        'variant_id' => $red->variant_id,
                        'variant_name' => 'Red',
                        'sku' => 'SYNC-RED',
                        'price' => 150,
                        'stock_quantity' => 12,
                        'option_values' => [['name' => 'Color', 'value' => 'Red']],
                        'is_primary' => true,
                    ],
                    [
                        'variant_name' => 'Green',
                        'sku' => 'SYNC-GREEN',
                        'price' => 200,
                        'stock_quantity' => 4,
                        'option_values' => [['name' => 'Color', 'value' => 'Green']],
                        'is_primary' => false,
                    ],
                ],
            ])
        );

        $response->assertRedirect(route('seller.products.index'));
        $response->assertSessionHasNoErrors();

        $red->refresh();
        $this->assertSame(150.0, (float) $red->price);
        $this->assertSame(12, (int) $red->stock_quantity);

        $green = ProductVariant::where('product_id', $product->product_id)
            ->where('sku', 'SYNC-GREEN')
            ->first();
        $this->assertNotNull($green);
        $this->assertSame(4, (int) $green->stock_quantity);

        $this->assertSoftDeleted('product_variants', ['variant_id' => $blue->variant_id]);
        $blue->refresh();
        $this->assertSame('SYNC-BLUE-del-'.$blue->variant_id, $blue->sku);
        $this->assertNull($blue->option_signature);

        $this->assertDatabaseHas('inventory_logs', [
            'variant_id' => $red->variant_id,
            'quantity_change' => 7,
            'reason' => 'Seller product update',
        ]);
        $this->assertDatabaseHas('inventory_logs', [
            'variant_id' => $green->variant_id,
            'quantity_change' => 4,
            'reason' => 'Initial stock on product update',
        ]);
    }

    public function test_removed_variant_sku_and_options_can_be_reused(): void
    {
        $product = $this->productFor($this->seller);

        $old = $this->variantFor($product, [
            'sku' => 'REUSE-1',
            'option_values' => [['name' => 'Color', 'value' => 'Red']],
            'option_signature' => 'color:red',
            'is_primary' => true,
        ]);

        $response = $this->actingAs($this->seller)->put(
            route('seller.products.update', $product),
            $this->updatePayload([
                'variants' => [
                    [
                        'variant_name' => 'Red replacement',
                        'sku' => 'REUSE-1',
                        'price' => 300,
                        'stock_quantity' => 2,
                        'option_values' => [['name' => 'Color', 'value' => 'Red']],
                        'is_primary' => true,
                    ],
                ],
            ])
        );

        $response->assertRedirect(route('seller.products.index'));
        $response->assertSessionHasNoErrors();

        $this->assertSoftDeleted('product_variants', ['variant_id' => $old->variant_id]);
        $this->assertDatabaseHas('product_variants', [
            'product_id' => $product->product_id,
            'sku' => 'REUSE-1',
            'option_signature' => 'color:red',
        ]);
    }

    public function test_empty_variants_payload_is_rejected_without_touching_existing_variants(): void
    {
        $product = $this->productFor($this->seller);
        $variant = $this->variantFor($product, ['sku' => 'EMPTY-1', 'is_primary' => true]);

        $response = $this->actingAs($this->seller)->put(
            route('seller.products.update', $product),
            $this->updatePayload(['variants' => []])
        );

        $response->assertSessionHasErrors('variants');
        $this->assertDatabaseHas('product_variants', [
            'variant_id' => $variant->variant_id,
            'sku' => 'EMPTY-1',
            'deleted_at' => null,
        ]);
    }

    public function test_store_creates_initial_stock_log_through_inventory_service(): void
    {
        $response = $this->actingAs($this->seller)->post(route('seller.products.store'), [
            'name' => 'Sản phẩm tồn kho',
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
            'status' => ProductStatus::DRAFT->value,
            'variants' => [
                [
                    'variant_name' => 'Mặc định',
                    'sku' => 'STOCK-INIT-1',
                    'price' => 500,
                    'stock_quantity' => 25,
                    'is_primary' => true,
                ],
            ],
        ]);

        $response->assertRedirect(route('seller.products.index'));
        $response->assertSessionHasNoErrors();

        $variant = ProductVariant::where('sku', 'STOCK-INIT-1')->firstOrFail();

        $this->assertSame(25, (int) $variant->stock_quantity);
        $this->assertDatabaseHas('inventory_logs', [
            'variant_id' => $variant->variant_id,
            'quantity_change' => 25,
            'reason' => 'Initial stock on product creation',
        ]);
    }

    public function test_store_keeps_business_words_in_name_and_description(): void
    {
        $response = $this->actingAs($this->seller)->post(route('seller.products.store'), [
            'name' => 'Drop shoulder - Create your style',
            'description' => 'Update your wardrobe with this select drop.',
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
            'status' => ProductStatus::DRAFT->value,
            'variants' => [
                [
                    'sku' => 'WORDS-1',
                    'price' => 100,
                    'stock_quantity' => 1,
                    'is_primary' => true,
                ],
            ],
        ]);

        $response->assertRedirect(route('seller.products.index'));
        $response->assertSessionHasNoErrors();

        $product = Product::whereJsonContains('name->vi', 'Drop shoulder - Create your style')->first();
        $this->assertNotNull($product);
        $this->assertSame('Drop shoulder - Create your style', $product->getTranslation('name', 'vi'));
        $this->assertSame('Update your wardrobe with this select drop.', $product->getTranslation('description', 'vi'));
    }

    public function test_store_rejects_gif_images(): void
    {
        Storage::fake('public');

        $response = $this->actingAs($this->seller)->post(route('seller.products.store'), [
            'name' => 'Sản phẩm có ảnh gif',
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
            'status' => ProductStatus::DRAFT->value,
            'variants' => [
                [
                    'sku' => 'GIF-1',
                    'price' => 100,
                    'stock_quantity' => 1,
                    'is_primary' => true,
                ],
            ],
            'images' => [
                UploadedFile::fake()->image('product.gif', 400, 400),
            ],
        ]);

        $response->assertSessionHasErrors('images.0');
        $this->assertDatabaseCount('products', 0);
    }

    public function test_index_search_matches_name_and_variant_sku(): void
    {
        $product = $this->productFor($this->seller, [
            'name' => ['vi' => 'Tai nghe XYZ', 'en' => 'XYZ Headphones'],
        ]);
        $this->variantFor($product, ['sku' => 'SKU-SEARCH-9']);

        $this->productFor($this->otherSeller, [
            'name' => ['vi' => 'Sản phẩm khác', 'en' => 'Other product'],
        ]);

        $this->actingAs($this->seller)
            ->get(route('seller.products.index', ['search' => 'SKU-SEARCH-9']))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Seller/Products/Index')
                ->has('products.data', 1)
                ->where('products.data.0.product_id', $product->product_id)
            );

        $this->actingAs($this->seller)
            ->get(route('seller.products.index', ['search' => 'XYZ']))
            ->assertInertia(fn (Assert $page) => $page
                ->has('products.data', 1)
                ->where('products.data.0.product_id', $product->product_id)
            );
    }

    public function test_destroy_removes_images_and_soft_deletes_variants(): void
    {
        Storage::fake('public');

        $product = $this->productFor($this->seller);
        $variant = $this->variantFor($product, ['sku' => 'DELETE-1', 'is_primary' => true]);

        Storage::disk('public')->put('products/delete-me.png', 'image-bytes');
        ProductImage::create([
            'product_id' => $product->product_id,
            'image_url' => 'products/delete-me.png',
            'is_primary' => true,
            'display_order' => 0,
        ]);

        $response = $this->actingAs($this->seller)->delete(route('seller.products.destroy', $product));

        $response->assertRedirect(route('seller.products.index'));
        $this->assertSoftDeleted('products', ['product_id' => $product->product_id]);
        $this->assertSoftDeleted('product_variants', ['variant_id' => $variant->variant_id]);
        $this->assertDatabaseMissing('product_images', ['product_id' => $product->product_id]);
        Storage::disk('public')->assertMissing('products/delete-me.png');
    }

    public function test_seller_cannot_update_another_sellers_product(): void
    {
        $product = $this->productFor($this->seller);

        $response = $this->actingAs($this->otherSeller)->put(
            route('seller.products.update', $product),
            $this->updatePayload()
        );

        $response->assertStatus(403);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function productFor(User $seller, array $overrides = []): Product
    {
        return Product::factory()->create(array_merge([
            'seller_id' => $seller->id,
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
            'status' => ProductStatus::DRAFT->value,
        ], $overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function variantFor(Product $product, array $overrides = []): ProductVariant
    {
        return $product->variants()->create(array_merge([
            'variant_name' => 'Default',
            'sku' => 'SKU-'.fake()->unique()->numerify('#####'),
            'price' => 100,
            'stock_quantity' => 5,
            'option_values' => null,
            'option_signature' => null,
            'is_primary' => true,
        ], $overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function updatePayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Tên đã cập nhật',
            'name_en' => 'Updated name',
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
            'status' => ProductStatus::PUBLISHED->value,
        ], $overrides);
    }
}
