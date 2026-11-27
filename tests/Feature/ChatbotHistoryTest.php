<?php

namespace Tests\Feature;

use App\Models\ChatMessage;
use App\Models\ChatRoom;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChatbotHistoryTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function guest_cannot_view_chatbot_history(): void
    {
        $this->getJson('/chatbot/history')->assertStatus(401);
    }

    #[Test]
    public function user_without_chatbot_role_cannot_view_history(): void
    {
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->actingAs($user)->getJson('/chatbot/history')->assertStatus(403);
    }

    #[Test]
    public function history_returns_only_the_authenticated_users_turns(): void
    {
        $customer = $this->makeUserWithRole('Customer');
        $otherCustomer = $this->makeUserWithRole('Customer');

        $this->storeTurn($customer, 'customer', 'Đơn hàng của tôi tới đâu?', 'Đơn đang được giao.');
        $this->storeTurn($otherCustomer, 'customer', 'Bí mật của người khác', 'Không được lộ.');

        $response = $this->actingAs($customer)->getJson('/chatbot/history');

        $response->assertOk()
            ->assertJsonCount(1, 'data.turns')
            ->assertJsonPath('data.turns.0.user_content', 'Đơn hàng của tôi tới đâu?')
            ->assertJsonPath('data.turns.0.assistant_content', 'Đơn đang được giao.');

        $this->assertStringNotContainsString('Bí mật của người khác', (string) $response->getContent());
    }

    #[Test]
    public function history_returns_turns_oldest_first_and_includes_product_cards(): void
    {
        $customer = $this->makeUserWithRole('Customer');
        $product = [
            'id' => 12,
            'name' => 'Áo thun cotton',
            'image' => '/storage/products/aothun.jpg',
            'price' => 199000,
            'compare_at' => null,
            'rating' => 4.6,
            'review_count' => 18,
            'shop_name' => 'ShopNest Official',
            'url' => '/product/12',
            'badges' => ['new'],
            'stock' => 'in',
        ];

        $this->storeTurn($customer, 'customer', 'Câu hỏi thứ nhất', 'Trả lời thứ nhất');
        $this->storeTurn($customer, 'customer', 'Câu hỏi thứ hai', 'Trả lời thứ hai', [$product]);

        $this->actingAs($customer)->getJson('/chatbot/history')
            ->assertOk()
            ->assertJsonCount(2, 'data.turns')
            ->assertJsonPath('data.turns.0.user_content', 'Câu hỏi thứ nhất')
            ->assertJsonPath('data.turns.1.user_content', 'Câu hỏi thứ hai')
            ->assertJsonPath('data.turns.1.products.0.name', 'Áo thun cotton')
            ->assertJsonPath('data.turns.1.products.0.price', 199000);
    }

    #[Test]
    public function history_is_isolated_by_role(): void
    {
        $user = $this->makeUserWithRole('Customer');

        $this->storeTurn($user, 'customer', 'Câu hỏi của khách', 'Trả lời cho khách');
        $this->storeTurn($user, 'admin', 'Câu hỏi của admin', 'Trả lời cho admin');

        $this->actingAs($user)->getJson('/chatbot/history')
            ->assertOk()
            ->assertJsonCount(1, 'data.turns')
            ->assertJsonPath('data.turns.0.user_content', 'Câu hỏi của khách');
    }

    #[Test]
    public function user_can_clear_own_history_without_touching_other_users(): void
    {
        $customer = $this->makeUserWithRole('Customer');
        $otherCustomer = $this->makeUserWithRole('Customer');

        $ownTurn = $this->storeTurn($customer, 'customer', 'Câu hỏi của tôi', 'Trả lời của tôi');
        $otherTurn = $this->storeTurn($otherCustomer, 'customer', 'Câu hỏi người khác', 'Trả lời người khác');

        $this->actingAs($customer)
            ->deleteJson('/chatbot/history')
            ->assertOk()
            ->assertJsonPath('data.deleted', 1);

        $this->assertDatabaseMissing('chat_messages', ['chat_message_id' => $ownTurn->getKey()]);
        $this->assertDatabaseHas('chat_messages', ['chat_message_id' => $otherTurn->getKey()]);
    }

    #[Test]
    public function second_message_includes_the_previous_turn_in_the_provider_prompt(): void
    {
        $this->configureProviders();

        /** @var array<int, array<string, mixed>> $payloads */
        $payloads = [];

        Http::fake([
            'https://api.groq.com/*' => function (ClientRequest $request) use (&$payloads) {
                $payloads[] = $request->data();

                return Http::response([
                    'choices' => [
                        ['message' => ['content' => 'Câu trả lời của trợ lý.']],
                    ],
                    'usage' => ['total_tokens' => 42],
                    'model' => 'qwen/qwen3.8-27b',
                ], 200);
            },
        ]);

        $user = $this->makeUserWithRole('Admin');

        $this->actingAs($user)
            ->postJson('/chatbot/message', ['message' => 'Doanh thu tháng này thế nào?'])
            ->assertOk();

        $this->actingAs($user)
            ->postJson('/chatbot/message', ['message' => 'Còn tồn kho thì sao?'])
            ->assertOk();

        $this->assertCount(2, $payloads);

        $secondPrompt = collect($payloads[1]['messages'] ?? []);

        $this->assertTrue(
            $secondPrompt->contains(fn ($message) => $message['role'] === 'user' && $message['content'] === 'Doanh thu tháng này thế nào?'),
            'Prompt thứ hai phải chứa câu hỏi của lượt trước.'
        );

        $this->assertTrue(
            $secondPrompt->contains(fn ($message) => $message['role'] === 'assistant' && $message['content'] === 'Câu trả lời của trợ lý.'),
            'Prompt thứ hai phải chứa câu trả lời của lượt trước.'
        );

        $this->assertStringContainsString('Còn tồn kho thì sao?', (string) $secondPrompt->last()['content']);
    }

    private function makeUserWithRole(string $roleName): User
    {
        $role = Role::query()->where('name->en', $roleName)->first()
            ?? Role::create([
                'name' => ['en' => $roleName, 'vi' => $roleName],
                'description' => ['en' => $roleName, 'vi' => $roleName],
            ]);

        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $user->roles()->attach($role->getKey());

        return $user;
    }

    /**
     * @param  array<int, array<string, mixed>>  $products
     */
    private function storeTurn(User $user, string $role, string $userContent, string $assistantContent, array $products = []): ChatMessage
    {
        $room = ChatRoom::firstOrCreate(
            ['room_name' => sprintf('chatbot:%d:%s', $user->getKey(), $role)],
            ['type' => 3, 'is_active' => true]
        );

        return ChatMessage::create([
            'chat_room_id' => $room->getKey(),
            'sender_id' => $user->getKey(),
            'role_context' => $role,
            'content' => $userContent,
            'assistant_content' => $assistantContent,
            'assistant_metadata' => ['products' => $products],
        ]);
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
}
