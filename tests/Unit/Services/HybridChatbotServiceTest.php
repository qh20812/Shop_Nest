<?php

namespace Tests\Unit\Services;

use App\Models\AnalyticsReport;
use App\Models\Category;
use App\Models\ChatMessage;
use App\Models\ChatRoom;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\Shop;
use App\Models\User;
use App\Services\HybridChatbotService;
use Illuminate\Database\UniqueConstraintViolationException;
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
            'discount_price' => null,
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

    #[Test]
    public function chatbot_room_name_is_unique(): void
    {
        ChatRoom::create([
            'room_name' => 'chatbot:99:customer',
            'type' => 3,
            'is_active' => true,
        ]);

        $this->expectException(UniqueConstraintViolationException::class);

        ChatRoom::create([
            'room_name' => 'chatbot:99:customer',
            'type' => 3,
            'is_active' => true,
        ]);
    }

    #[Test]
    public function recreates_chatbot_room_when_the_cached_room_is_gone(): void
    {
        Http::fake();

        /** @var User $user */
        $user = User::factory()->create();
        $this->attachRole($user, 'Customer', 'Khách hàng');

        $service = $this->app->make(HybridChatbotService::class);
        $service->sendMessage($user, 'Xin chào');

        $firstRoomId = ChatRoom::query()->value('chat_room_id');
        $this->assertNotNull($firstRoomId);

        ChatRoom::query()->delete();

        $result = $service->sendMessage($user, 'Xin chào');

        $this->assertSame('local', $result['provider']);
        $this->assertSame(1, ChatRoom::query()->count());
        $this->assertNotSame($firstRoomId, ChatRoom::query()->value('chat_room_id'));
    }

    #[Test]
    public function seller_with_customer_role_still_receives_product_cards(): void
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

        $product = $this->createStorefrontProduct('Kem chống nắng');

        /** @var User $user */
        $user = User::factory()->create();
        $this->attachRole($user, 'Seller', 'Người bán');
        $this->attachRole($user, 'Customer', 'Khách hàng');

        $result = $this->app->make(HybridChatbotService::class)
            ->sendMessage($user, 'Gợi ý kem chống nắng');

        $this->assertSame('seller', $result['role']);
        $this->assertCount(1, $result['products']);
        $this->assertSame($product->product_id, $result['products'][0]['id']);
    }

    #[Test]
    public function follow_up_question_returns_the_referenced_product(): void
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

        $this->createStorefrontProduct('Kem chống nắng A', 300000);
        $this->createStorefrontProduct('Kem chống nắng B', 400000);

        /** @var User $user */
        $user = User::factory()->create();
        $this->attachRole($user, 'Customer', 'Khách hàng');

        $service = $this->app->make(HybridChatbotService::class);
        $first = $service->sendMessage($user, 'Gợi ý kem chống nắng');

        $this->assertGreaterThanOrEqual(2, count($first['products']));
        $expectedId = $first['products'][1]['id'];

        $second = $service->sendMessage($user, 'cái thứ 2 thì sao');

        $this->assertCount(1, $second['products']);
        $this->assertSame($expectedId, $second['products'][0]['id']);
    }

    #[Test]
    public function uses_the_configured_model_instead_of_a_hardcoded_one(): void
    {
        $this->configureProviders();
        config([
            'services.groq.default_model' => 'custom-groq-model',
            'services.groq.role_models' => [],
        ]);

        Http::fake([
            'https://api.groq.com/*' => Http::response([
                'choices' => [
                    ['message' => ['content' => 'Đã rõ.']],
                ],
                'usage' => ['total_tokens' => 10],
                'model' => 'custom-groq-model',
            ], 200),
        ]);

        /** @var User $user */
        $user = User::factory()->create();
        $this->attachRole($user, 'Customer', 'Khách hàng');

        $this->app->make(HybridChatbotService::class)->sendMessage($user, 'Tư vấn giúp tôi');

        Http::assertSent(fn ($request) => $request->data()['model'] === 'custom-groq-model');
    }

    private function createStorefrontProduct(string $name, int $price = 300000): Product
    {
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
            'name' => ['vi' => $name, 'en' => $name],
        ]);

        ProductImage::factory()->create([
            'product_id' => $product->product_id,
            'is_primary' => true,
            'display_order' => 0,
        ]);

        ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => $price,
            'discount_price' => null,
            'stock_quantity' => 10,
        ]);

        return $product;
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
