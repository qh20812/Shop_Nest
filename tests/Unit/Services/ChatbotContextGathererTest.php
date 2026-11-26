<?php

namespace Tests\Unit\Services;

use App\Enums\OrderStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Shop;
use App\Models\User;
use App\Services\ContextGatherers\AdminContextGatherer;
use App\Services\ContextGatherers\CustomerContextGatherer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChatbotContextGathererTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function admin_revenue_excludes_cancelled_and_returned_orders(): void
    {
        $admin = User::factory()->create();

        Order::factory()->create([
            'status' => OrderStatus::DELIVERED->value,
            'total_amount' => 500,
        ]);

        Order::factory()->create([
            'status' => OrderStatus::CANCELLED->value,
            'total_amount' => 1000,
        ]);

        Order::factory()->create([
            'status' => OrderStatus::RETURNED->value,
            'total_amount' => 2000,
        ]);

        $context = (new AdminContextGatherer)->gather($admin);

        $this->assertSame(3, $context['summary']['orders_last_30_days']);
        $this->assertSame(500.0, $context['summary']['revenue_last_30_days']);
    }

    #[Test]
    public function customer_recommendations_only_include_purchasable_products(): void
    {
        $customer = User::factory()->create();

        $valid = $this->createProduct('Sản phẩm hợp lệ');
        $draft = $this->createProduct('Sản phẩm nháp', ['status' => 'draft']);
        $inactive = $this->createProduct('Sản phẩm ngừng bán', ['is_active' => false]);
        $outOfStock = $this->createProduct('Sản phẩm hết hàng', ['stock' => 0]);
        $inactiveShop = $this->createProduct('Sản phẩm shop tạm dừng', ['shop_status' => 'pending']);

        $context = (new CustomerContextGatherer)->gather($customer);
        $ids = collect($context['recommendations'])->pluck('id')->map(fn ($id) => (int) $id)->all();

        $this->assertContains($valid->product_id, $ids);
        $this->assertNotContains($draft->product_id, $ids);
        $this->assertNotContains($inactive->product_id, $ids);
        $this->assertNotContains($outOfStock->product_id, $ids);
        $this->assertNotContains($inactiveShop->product_id, $ids);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createProduct(string $name, array $overrides = []): Product
    {
        $shopStatus = $overrides['shop_status'] ?? 'active';

        $shop = Shop::factory()->create([
            'status' => $shopStatus,
            'is_verified' => $shopStatus === 'active',
        ]);

        $category = Category::create([
            'name' => ['vi' => 'Chăm sóc da', 'en' => 'Skincare'],
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'shop_id' => $shop->id,
            'seller_id' => $shop->owner_id,
            'category_id' => $category->category_id,
            'status' => $overrides['status'] ?? 'published',
            'is_active' => $overrides['is_active'] ?? true,
            'name' => ['vi' => $name, 'en' => $name],
        ]);

        ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => 300000,
            'discount_price' => null,
            'stock_quantity' => $overrides['stock'] ?? 5,
        ]);

        return $product;
    }
}
