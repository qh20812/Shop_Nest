<?php

namespace Tests\Unit\Services;

use App\Models\AnalyticsReport;
use App\Models\Category;
use App\Models\ChatMessage;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\Shop;
use App\Models\User;
use App\Services\HybridChatbotService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HybridChatbotServiceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function admin_role_prefers_openai_provider(): void
    {
        $this->configureProviders();

        Http::fake([
            'https://api.openai.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Báo cáo doanh thu tổng hợp.']],
                ],
                'usage' => ['total_tokens' => 120],
                'model' => 'gpt-4o-mini',
            ], 200),
            '*' => Http::response([], 500),
        ]);

        $user = User::factory()->create();
        $this->attachRole($user, 'Admin', 'Quản trị');

        $service = $this->app->make(HybridChatbotService::class);
        $result = $service->sendMessage($user, 'Cho tôi biết doanh thu tháng này.');

        $this->assertSame('openai', $result['provider']);
        $this->assertSame('admin', $result['role']);
        $this->assertNotEmpty($result['reply']);
    }

    #[Test]
    public function customer_role_prefers_groq_provider(): void
    {
        $this->configureProviders();

        Http::fake([
            'https://api.groq.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Tôi có thể giúp bạn tìm sản phẩm phù hợp.']],
                ],
                'usage' => ['total_tokens' => 100],
                'model' => 'qwen/qwen3.8-27b',
            ], 200),
            '*' => Http::response([], 500),
        ]);

        $user = User::factory()->create();
        $this->attachRole($user, 'Customer', 'Khách hàng');

        $service = $this->app->make(HybridChatbotService::class);
        $result = $service->sendMessage($user, 'Gợi ý sản phẩm cho tôi.');

        $this->assertSame('groq', $result['provider']);
        $this->assertSame('customer', $result['role']);
        $this->assertNotEmpty($result['reply']);

        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'api.groq.com')
                && $request['model'] === 'qwen/qwen3.8-27b';
        });
    }

    #[Test]
    public function seller_role_prefers_groq_provider(): void
    {
        $this->configureProviders();

        Http::fake([
            'https://api.groq.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Tôi có thể hỗ trợ quản lý cửa hàng của bạn.']],
                ],
                'usage' => ['total_tokens' => 110],
                'model' => 'qwen/qwen3.8-27b',
            ], 200),
            '*' => Http::response([], 500),
        ]);

        $user = User::factory()->create();
        $this->attachRole($user, 'Seller', 'Người bán');

        $service = $this->app->make(HybridChatbotService::class);
        $result = $service->sendMessage($user, 'Hỗ trợ quản lý sản phẩm.');

        $this->assertSame('groq', $result['provider']);
        $this->assertSame('seller', $result['role']);
        $this->assertNotEmpty($result['reply']);
    }

    #[Test]
    public function fallback_to_openai_when_groq_fails(): void
    {
        $this->configureProviders();

        Http::fake([
            'https://api.groq.com/*' => Http::response([], 500),
            'https://api.openai.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Fallback response from OpenAI.']],
                ],
                'usage' => ['total_tokens' => 130],
                'model' => 'gpt-4o-mini',
            ], 200),
        ]);

        $user = User::factory()->create();
        $this->attachRole($user, 'Customer', 'Khách hàng');

        $service = $this->app->make(HybridChatbotService::class);
        $result = $service->sendMessage($user, 'Test fallback.');

        $this->assertSame('openai', $result['provider']);
        $this->assertSame('customer', $result['role']);
        $this->assertNotEmpty($result['reply']);
    }

    #[Test]
    public function handles_api_timeout(): void
    {
        $this->configureProviders();

        Http::fake([
            '*' => Http::response('Gateway Timeout', 504),
        ]);

        /** @var User $user */
        $user = User::factory()->create();
        $this->attachRole($user, 'Admin', 'Quản trị');

        $service = $this->app->make(HybridChatbotService::class);
        $result = $service->sendMessage($user, 'Test timeout.');

        $this->assertSame('fallback', $result['provider']);
        $this->assertSame('admin', $result['role']);
        $this->assertNotEmpty($result['reply']);
    }

    #[Test]
    public function handles_invalid_response(): void
    {
        $this->configureProviders();

        Http::fake([
            'https://api.openai.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => '']],
                ],
            ], 200),
        ]);

        /** @var User $user */
        $user = User::factory()->create();
        $this->attachRole($user, 'Admin', 'Quản trị');

        $service = $this->app->make(HybridChatbotService::class);
        $result = $service->sendMessage($user, 'Test invalid response.');

        $this->assertSame('fallback', $result['provider']);
        $this->assertSame('admin', $result['role']);
        $this->assertNotEmpty($result['reply']);
    }

    #[Test]
    public function gathers_context_for_admin(): void
    {
        $this->configureProviders();

        // Create sample data
        $user = User::factory()->create();
        $this->attachRole($user, 'Admin', 'Quản trị');

        // Mock analytics report
        AnalyticsReport::create([
            'title' => 'Monthly Sales',
            'type' => 'revenue',
            'period_type' => 'monthly',
            'start_date' => now()->startOfMonth(),
            'end_date' => now()->endOfMonth(),
            'parameters' => ['metric' => 'total_sales'],
            'result_data' => ['total' => 10000],
            'status' => 'completed',
            'created_by' => $user->id,
        ]);

        Http::fake([
            'https://api.openai.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Báo cáo doanh thu: 10000']],
                ],
                'usage' => ['total_tokens' => 120],
                'model' => 'gpt-4o-mini',
            ], 200),
        ]);

        $service = $this->app->make(HybridChatbotService::class);
        $result = $service->sendMessage($user, 'Cho tôi biết doanh thu tháng này.');

        $this->assertSame('openai', $result['provider']);
        $this->assertSame('admin', $result['role']);

        // Check that context was stored in DB
        $chatMessage = ChatMessage::find($result['message_id']);
        $this->assertNotNull($chatMessage);
        $this->assertNotNull($chatMessage->context_snapshot);
        $this->assertArrayHasKey('recent_reports', $chatMessage->context_snapshot);
    }

    #[Test]
    public function greeting_returns_local_response_without_calling_ai(): void
    {
        Http::fake();

        /** @var User $user */
        $user = User::factory()->create();
        $this->attachRole($user, 'Customer', 'Khách hàng');

        $service = $this->app->make(HybridChatbotService::class);
        $result = $service->sendMessage($user, 'hi');

        $this->assertSame('local', $result['provider']);
        $this->assertSame('customer', $result['role']);
        $this->assertNotEmpty($result['reply']);
        Http::assertNothingSent();

        $chatMessage = ChatMessage::find($result['message_id']);
        $this->assertNotNull($chatMessage);
        $this->assertSame('local', $chatMessage->assistant_api);
    }

    #[Test]
    public function message_containing_hi_is_not_treated_as_greeting(): void
    {
        $this->configureProviders();

        Http::fake([
            'https://api.groq.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Quy trình đổi trả gồm 3 bước.']],
                ],
                'usage' => ['total_tokens' => 100],
                'model' => 'qwen/qwen3.8-27b',
            ], 200),
        ]);

        /** @var User $user */
        $user = User::factory()->create();
        $this->attachRole($user, 'Customer', 'Khách hàng');

        $service = $this->app->make(HybridChatbotService::class);
        $result = $service->sendMessage($user, 'Tôi không hiểu quy trình đổi trả');

        $this->assertSame('groq', $result['provider']);
        $this->assertNotEmpty($result['reply']);
    }

    #[Test]
    public function customer_query_returns_product_cards_from_database(): void
    {
        $this->configureProviders();

        Http::fake([
            'https://api.groq.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Mình gợi ý sản phẩm dưới đây.']],
                ],
                'usage' => ['total_tokens' => 100],
                'model' => 'qwen/qwen3.8-27b',
            ], 200),
        ]);

        $shop = Shop::factory()->create(['status' => 'active', 'is_verified' => true]);
        $category = Category::create([
            'name' => ['vi' => 'Chăm sóc da', 'en' => 'Skincare'],
            'is_active' => true,
        ]);
        $product = Product::factory()->create([
            'shop_id' => $shop->id,
            'seller_id' => $shop->owner_id,
            'category_id' => $category->category_id,
            'status' => 'published',
            'is_active' => true,
            'name' => ['vi' => 'Kem chống nắng', 'en' => 'Sunscreen'],
        ]);
        ProductImage::factory()->create(['product_id' => $product->product_id, 'is_primary' => true]);
        ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => 300000,
            'stock_quantity' => 10,
        ]);

        $user = User::factory()->create();
        $this->attachRole($user, 'Customer', 'Khách hàng');

        $result = $this->app->make(HybridChatbotService::class)
            ->sendMessage($user, 'Gợi ý sản phẩm kem chống nắng dưới 500k');

        $this->assertSame('groq', $result['provider']);
        $this->assertCount(1, $result['products']);
        $this->assertSame($product->product_id, $result['products'][0]['id']);
    }

    private function configureProviders(): void
    {
        config([
            'services.openai.api_key' => 'test-openai-key',
            'services.openai.base_url' => 'https://api.openai.com/v1',
            'services.openai.default_model' => 'gpt-4o-mini',
            'services.openai.timeout' => 5,
            'services.groq.api_key' => 'test-groq-key',
            'services.groq.base_url' => 'https://api.groq.com/openai/v1',
            'services.groq.default_model' => 'qwen/qwen3.8-27b',
            'services.groq.timeout' => 5,
        ]);
    }

    private function attachRole(User $user, string $nameEn, string $nameVi): void
    {
        $role = Role::create([
            'name' => ['en' => $nameEn, 'vi' => $nameVi],
            'description' => ['en' => $nameEn, 'vi' => $nameVi],
        ]);

        $user->roles()->attach($role->id);
    }
}
