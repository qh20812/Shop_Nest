<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ChatbotTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function unauthenticated_user_cannot_access_chatbot(): void
    {
    $response = $this->postJson('/chatbot/message', [
            'message' => 'Hello chatbot',
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function user_without_proper_role_cannot_access_chatbot(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

    $response = $this->actingAs($user)->postJson('/chatbot/message', [
            'message' => 'Hello chatbot',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function admin_can_send_message_and_get_response(): void
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
        ]);

        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $this->attachRole($user, 'Admin', 'Quản trị');

    $response = $this->actingAs($user)->postJson('/chatbot/message', [
            'message' => 'Cho tôi biết doanh thu tháng này.',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'reply',
                    'provider',
                    'role',
                    'message_id',
                    'latency_ms',
                    'usage',
                ],
            ])
            ->assertJson([
                'data' => [
                    'provider' => 'openai',
                    'role' => 'admin',
                ],
            ]);
    }

    /** @test */
    public function message_is_required(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $this->attachRole($user, 'Admin', 'Quản trị');

    $response = $this->actingAs($user)->postJson('/chatbot/message', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['message']);
    }

    /** @test */
    public function returns_fallback_response_when_all_providers_fail(): void
    {
        $this->configureProviders();

        Http::fake([
            '*' => Http::response('Internal Server Error', 500),
        ]);

        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $this->attachRole($user, 'Admin', 'Quản trị');

        $response = $this->actingAs($user)->postJson('/chatbot/message', [
            'message' => 'Test failure.',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.provider', 'fallback')
            ->assertJsonPath('data.role', 'admin')
            ->assertJsonPath('data.reply', fn ($value) => is_string($value) && $value !== '');
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
            'services.groq.default_model' => 'llama3-70b-8192',
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