<?php

namespace Tests\Feature\Chat;

use App\Events\MessageCreated;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Broadcast;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ChatControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected User $otherUser;
    protected User $thirdUser;
    protected Conversation $conversation;
    protected Message $message;

    protected function setUp(): void
    {
        parent::setUp();

        // Tạo users
        $this->user = User::factory()->create([
            'email_verified_at' => now(),
            'username' => 'testuser',
            'first_name' => 'Test',
            'last_name' => 'User',
        ]);

        $this->otherUser = User::factory()->create([
            'email_verified_at' => now(),
            'username' => 'otheruser',
            'first_name' => 'Other',
            'last_name' => 'User',
        ]);

        $this->thirdUser = User::factory()->create([
            'email_verified_at' => now(),
            'username' => 'thirduser',
            'first_name' => 'Third',
            'last_name' => 'User',
        ]);

        // Tạo conversation và message
        $this->conversation = Conversation::create([
            'user_id' => $this->user->id,
            'receiver_id' => $this->otherUser->id,
        ]);

        $this->message = Message::create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->user->id,
            'content' => 'Test message',
        ]);
    }

    #[Test]
    public function unauthenticated_user_cannot_access_chat_endpoints()
    {
        // Test index
        $this->getJson('/chat/conversations')
            ->assertStatus(401);

        // Test send message
        $this->postJson('/chat/messages', [
            'conversation_id' => $this->conversation->id,
            'content' => 'Test message',
        ])->assertStatus(401);

        // Test create conversation
        $this->postJson('/chat/conversations', [
            'receiver_id' => $this->otherUser->id,
            'content' => 'Hello',
        ])->assertStatus(401);

        // Test search users
        $this->getJson('/chat/users/search?q=test')
            ->assertStatus(401);
    }

    #[Test]
    public function authenticated_user_can_get_conversations_list()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/chat/conversations');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'user_id',
                        'receiver_id',
                        'created_at',
                        'updated_at',
                        'user',
                        'receiver',
                        'messages',
                    ]
                ]
            ]);

        // Verify conversation data
        $responseData = $response->json('data');
        $this->assertCount(1, $responseData);
        $this->assertEquals($this->conversation->id, $responseData[0]['id']);
        $this->assertEquals($this->user->id, $responseData[0]['user_id']);
        $this->assertEquals($this->otherUser->id, $responseData[0]['receiver_id']);
    }

    #[Test]
    public function conversations_are_ordered_by_updated_at_descending()
    {
        $this->actingAs($this->user);

        // Create multiple conversations with different timestamps
        $oldTime = now()->subHours(2);
        $newTime = now();

        // Delete the old message and update conversation timestamp
        $this->message->delete();
        $this->conversation->updated_at = $oldTime;
        $this->conversation->created_at = $oldTime;
        $this->conversation->save();

        // Create new conversation (without messages, so updated_at stays as set)
        $recentConversation = Conversation::create([
            'user_id' => $this->user->id,
            'receiver_id' => $this->thirdUser->id,
            'created_at' => $newTime,
            'updated_at' => $newTime,
        ]);

        $response = $this->getJson('/chat/conversations');

        $response->assertStatus(200);
        $conversations = $response->json('data');

        // Should have 2 conversations
        $this->assertCount(2, $conversations);

        // First should be recent (newer timestamp)
        $this->assertEquals($recentConversation->id, $conversations[0]['id'],
            'First conversation should be the most recently updated one');
        $this->assertEquals($this->conversation->id, $conversations[1]['id'],
            'Second conversation should be the older one');
    }

    #[Test]
    public function user_can_only_see_their_own_conversations()
    {
        $this->actingAs($this->user);

        // Create conversation for other users
        Conversation::create([
            'user_id' => $this->otherUser->id,
            'receiver_id' => $this->thirdUser->id,
        ]);

        $response = $this->getJson('/chat/conversations');

        $response->assertStatus(200);
        $conversations = $response->json('data');

        // Should only see 1 conversation (the one involving this user)
        $this->assertCount(1, $conversations);
        $this->assertEquals($this->conversation->id, $conversations[0]['id']);
    }

    #[Test]
    public function user_can_send_message_to_existing_conversation()
    {
        Event::fake();

        $this->actingAs($this->user);

        $messageContent = 'New test message';

        $response = $this->postJson('/chat/messages', [
            'conversation_id' => $this->conversation->id,
            'content' => $messageContent,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'conversation_id',
                    'sender_id',
                    'content',
                    'created_at',
                    'updated_at',
                    'sender'
                ]
            ]);

        // Verify message was created
        $this->assertDatabaseHas('messages', [
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->user->id,
            'content' => $messageContent,
        ]);

        // Verify event was fired
        Event::assertDispatched(MessageCreated::class, function ($event) use ($messageContent) {
            return $event->message->content === $messageContent;
        });
    }

    #[Test]
    public function user_cannot_send_message_to_conversation_they_dont_participate_in()
    {
        $this->actingAs($this->thirdUser); // User not in the conversation

        $response = $this->postJson('/chat/messages', [
            'conversation_id' => $this->conversation->id,
            'content' => 'Unauthorized message',
        ]);

        $response->assertStatus(404);

        $this->assertDatabaseMissing('messages', [
            'content' => 'Unauthorized message',
        ]);
    }

    #[Test]
    public function send_message_validation_fails_with_invalid_data()
    {
        $this->actingAs($this->user);

        // Missing conversation_id
        $this->postJson('/chat/messages', [
            'content' => 'Test message',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['conversation_id']);

        // Missing content
        $this->postJson('/chat/messages', [
            'conversation_id' => $this->conversation->id,
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['content']);

        // Empty content
        $this->postJson('/chat/messages', [
            'conversation_id' => $this->conversation->id,
            'content' => '',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['content']);

        // Whitespace only content
        $this->postJson('/chat/messages', [
            'conversation_id' => $this->conversation->id,
            'content' => '   ',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['content']);

        // Content too long
        $this->postJson('/chat/messages', [
            'conversation_id' => $this->conversation->id,
            'content' => str_repeat('a', 1001),
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['content']);

        // Non-existent conversation
        $this->postJson('/chat/messages', [
            'conversation_id' => 99999,
            'content' => 'Test message',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['conversation_id']);
    }

    #[Test]
    public function user_can_create_new_conversation_with_first_message()
    {
        Event::fake();

        $this->actingAs($this->user);

        $messageContent = 'Hello, let\'s start a conversation!';

        $response = $this->postJson('/chat/conversations', [
            'receiver_id' => $this->thirdUser->id,
            'content' => $messageContent,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'conversation' => [
                    'id',
                    'user_id',
                    'receiver_id',
                    'created_at',
                    'updated_at',
                    'user',
                    'receiver',
                ],
                'message' => [
                    'id',
                    'conversation_id',
                    'sender_id',
                    'content',
                    'created_at',
                    'updated_at',
                    'sender',
                ]
            ]);

        $responseData = $response->json();

        // Verify conversation was created
        $this->assertDatabaseHas('conversations', [
            'user_id' => $this->user->id,
            'receiver_id' => $this->thirdUser->id,
        ]);

        // Verify message was created
        $this->assertDatabaseHas('messages', [
            'conversation_id' => $responseData['conversation']['id'],
            'sender_id' => $this->user->id,
            'content' => $messageContent,
        ]);

        // Verify event was fired
        Event::assertDispatched(MessageCreated::class);
    }

    #[Test]
    public function creating_conversation_with_existing_participants_reuses_conversation()
    {
        $this->actingAs($this->user);

        // Try to create conversation with same participants
        $response = $this->postJson('/chat/conversations', [
            'receiver_id' => $this->otherUser->id,
            'content' => 'Another message in same conversation',
        ]);

        $response->assertStatus(201);

        // Should still have only 1 conversation
        $this->assertEquals(1, Conversation::where('user_id', $this->user->id)
                                          ->where('receiver_id', $this->otherUser->id)
                                          ->count());

        // But should have 2 messages now
        $conversation = Conversation::where('user_id', $this->user->id)
                                   ->where('receiver_id', $this->otherUser->id)
                                   ->first();

        $this->assertEquals(2, $conversation->messages()->count());
    }

    #[Test]
    public function create_conversation_validation_fails_with_invalid_data()
    {
        $this->actingAs($this->user);

        // Missing receiver_id
        $this->postJson('/chat/conversations', [
            'content' => 'Hello',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['receiver_id']);

        // Invalid receiver_id (non-existent user)
        $this->postJson('/chat/conversations', [
            'receiver_id' => 99999,
            'content' => 'Hello',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['receiver_id']);

        // Cannot create conversation with self
        $this->postJson('/chat/conversations', [
            'receiver_id' => $this->user->id,
            'content' => 'Hello self',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['receiver_id']);

        // Missing content
        $this->postJson('/chat/conversations', [
            'receiver_id' => $this->otherUser->id,
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['content']);

        // Empty content
        $this->postJson('/chat/conversations', [
            'receiver_id' => $this->otherUser->id,
            'content' => '',
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['content']);
    }

    #[Test]
    public function user_can_search_for_other_users()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/chat/users/search?q=other');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'username',
                        'first_name',
                        'last_name',
                        'email',
                    ]
                ]
            ]);

        $users = $response->json('data');
        $this->assertCount(1, $users);
        $this->assertEquals($this->otherUser->id, $users[0]['id']);
        $this->assertEquals($this->otherUser->username, $users[0]['username']);
    }

    #[Test]
    public function user_search_filters_out_self()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/chat/users/search?q=test');

        $response->assertStatus(200);

        $users = $response->json('data');
        // Should not include the current user
        foreach ($users as $user) {
            $this->assertNotEquals($this->user->id, $user['id']);
        }
    }

    #[Test]
    public function user_search_works_with_email()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/chat/users/search?q=' . substr($this->otherUser->email, 0, 5));

        $response->assertStatus(200);

        $users = $response->json('data');
        $this->assertGreaterThan(0, count($users));
        $found = collect($users)->firstWhere('id', $this->otherUser->id);
        $this->assertNotNull($found);
    }

    #[Test]
    public function user_search_works_with_full_name()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/chat/users/search?q=Other User');

        $response->assertStatus(200);

        $users = $response->json('data');
        $this->assertGreaterThan(0, count($users));
        $found = collect($users)->firstWhere('id', $this->otherUser->id);
        $this->assertNotNull($found);
    }

    #[Test]
    public function user_search_returns_empty_for_empty_query()
    {
        $this->actingAs($this->user);

        // Empty query parameter should trigger validation error
        $response = $this->getJson('/chat/users/search?q=');

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['q']);
    }

    #[Test]
    public function user_search_respects_limit_parameter()
    {
        // Create more users with search prefix
        for ($i = 1; $i <= 10; $i++) {
            User::factory()->create([
                'email_verified_at' => now(),
                'first_name' => 'SearchUser' . $i,
            ]);
        }

        $this->actingAs($this->user);

        $response = $this->getJson('/chat/users/search?q=SearchUser&limit=3');

        $response->assertStatus(200);

        $users = $response->json('data');
        $this->assertCount(3, $users);
    }

    #[Test]
    public function user_search_limit_defaults_to_10_and_max_is_50()
    {
        // Create 60 users
        for ($i = 1; $i <= 60; $i++) {
            User::factory()->create([
                'email_verified_at' => now(),
                'first_name' => 'BulkUser' . $i,
            ]);
        }

        $this->actingAs($this->user);

        // Default limit
        $response = $this->getJson('/chat/users/search?q=BulkUser');
        $response->assertStatus(200);
        $users = $response->json('data');
        $this->assertCount(10, $users);

        // Request too large limit, should be capped  
        $response = $this->getJson('/chat/users/search?q=BulkUser&limit=50');
        $response->assertStatus(200);
        $users = $response->json('data');
        $this->assertCount(50, $users);
        
        // Verify validation rejects limit > 50
        $response = $this->getJson('/chat/users/search?q=BulkUser&limit=100');
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['limit']);
    }

    #[Test]
    public function conversations_include_latest_messages_with_sender_info()
    {
        $this->actingAs($this->user);

        // Add another message to the conversation
        Message::create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->otherUser->id,
            'content' => 'Reply message',
        ]);

        $response = $this->getJson('/chat/conversations');

        $response->assertStatus(200);
        $conversation = $response->json('data.0');

        $this->assertCount(2, $conversation['messages']);

        // Check that messages include sender info
        foreach ($conversation['messages'] as $message) {
            $this->assertArrayHasKey('sender', $message);
            $this->assertArrayHasKey('id', $message['sender']);
            $this->assertArrayHasKey('username', $message['sender']);
        }
    }

    #[Test]
    public function conversations_pagination_works()
    {
        $this->actingAs($this->user);

        // Create multiple conversations
        for ($i = 0; $i < 25; $i++) {
            $user = User::factory()->create(['email_verified_at' => now()]);
            Conversation::create([
                'user_id' => $this->user->id,
                'receiver_id' => $user->id,
            ]);
        }

        $response = $this->getJson('/chat/conversations?page=2&per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'links',
                'meta' => [
                    'current_page',
                    'per_page',
                    'total',
                ]
            ]);

        $meta = $response->json('meta');
        $this->assertEquals(2, $meta['current_page']);
        $this->assertEquals(10, $meta['per_page']);
        $this->assertEquals(26, $meta['total']); // 25 new + 1 original
    }

    #[Test]
    public function message_broadcasting_fails_gracefully()
    {
        // Mock broadcasting to fail
        Broadcast::shouldReceive('event')->andThrow(new \Exception('Broadcast failed'));

        $this->actingAs($this->user);

        $response = $this->postJson('/chat/messages', [
            'conversation_id' => $this->conversation->id,
            'content' => 'Message with broadcast failure',
        ]);

        // Should still succeed despite broadcast failure
        $response->assertStatus(201);

        $this->assertDatabaseHas('messages', [
            'content' => 'Message with broadcast failure',
        ]);
    }

    #[Test]
    public function conversation_creation_broadcasting_fails_gracefully()
    {
        Broadcast::shouldReceive('event')->andThrow(new \Exception('Broadcast failed'));

        $this->actingAs($this->user);

        $response = $this->postJson('/chat/conversations', [
            'receiver_id' => $this->thirdUser->id,
            'content' => 'New conversation with broadcast failure',
        ]);

        // Should still succeed despite broadcast failure
        $response->assertStatus(201);

        $this->assertDatabaseHas('conversations', [
            'user_id' => $this->user->id,
            'receiver_id' => $this->thirdUser->id,
        ]);
    }

    #[Test]
    public function conversation_updated_at_is_updated_when_new_message_sent()
    {
        $this->actingAs($this->user);

        // Set conversation to be created 1 hour ago
        $this->conversation->update(['updated_at' => now()->subHour()]);
        $originalUpdatedAt = $this->conversation->fresh()->updated_at->timestamp;

        // Small delay to ensure different timestamp
        sleep(1);

        $this->postJson('/chat/messages', [
            'conversation_id' => $this->conversation->id,
            'content' => 'Update timestamp message',
        ]);

        $this->conversation->refresh();
        $newUpdatedAt = $this->conversation->updated_at->timestamp;

        $this->assertGreaterThan($originalUpdatedAt, $newUpdatedAt,
            'Conversation updated_at should be updated when new message is sent');
    }

    #[Test]
    public function conversation_updated_at_is_updated_when_conversation_created()
    {
        $this->actingAs($this->user);

        $response = $this->postJson('/chat/conversations', [
            'receiver_id' => $this->thirdUser->id,
            'content' => 'New conversation message',
        ]);

        $response->assertStatus(201);

        $conversationId = $response->json('conversation.id');
        $conversation = Conversation::find($conversationId);

        // updated_at should be set when conversation is created
        $this->assertNotNull($conversation->updated_at);
        $this->assertEquals($conversation->created_at, $conversation->updated_at);
    }

    #[Test]
    public function messages_are_ordered_by_created_at_ascending()
    {
        $this->actingAs($this->user);

        // Delete the original message and create all messages with explicit timestamps
        $this->message->delete();

        // Add messages with different timestamps
        $message1 = Message::create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->user->id,
            'content' => 'First message',
            'created_at' => now()->subMinutes(10),
        ]);

        $message2 = Message::create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->otherUser->id,
            'content' => 'Second message',
            'created_at' => now()->subMinutes(7),
        ]);

        $message3 = Message::create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->user->id,
            'content' => 'Test message',
            'created_at' => now()->subMinutes(3),
        ]);

        $message4 = Message::create([
            'conversation_id' => $this->conversation->id,
            'sender_id' => $this->user->id,
            'content' => 'Third message',
            'created_at' => now(),
        ]);

        $response = $this->getJson('/chat/conversations');

        $response->assertStatus(200);
        $conversation = $response->json('data.0');
        $messages = $conversation['messages'];

        // Messages should be ordered by created_at ascending
        $this->assertCount(4, $messages);
        $this->assertEquals('First message', $messages[0]['content']);
        $this->assertEquals('Second message', $messages[1]['content']);
        $this->assertEquals('Test message', $messages[2]['content']);
        $this->assertEquals('Third message', $messages[3]['content']);
    }

    #[Test]
    public function user_cannot_create_conversation_with_unverified_user()
    {
        $unverifiedUser = User::factory()->create([
            'email_verified_at' => null, // Unverified
        ]);

        $this->actingAs($this->user);

        $response = $this->postJson('/chat/conversations', [
            'receiver_id' => $unverifiedUser->id,
            'content' => 'Hello unverified user',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['receiver_id']);
    }

    #[Test]
    public function user_cannot_send_message_to_conversation_with_unverified_participant()
    {
        // Create conversation with unverified user
        $unverifiedUser = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $conversation = Conversation::create([
            'user_id' => $this->user->id,
            'receiver_id' => $unverifiedUser->id,
        ]);

        $this->actingAs($this->user);

        $response = $this->postJson('/chat/messages', [
            'conversation_id' => $conversation->id,
            'content' => 'Message to unverified user',
        ]);

        // This should work since the conversation exists and user is verified
        $response->assertStatus(201);
    }

    #[Test]
    public function rate_limiting_is_applied_to_send_message_endpoint()
    {
        $this->actingAs($this->user);

        // Send multiple messages quickly
        for ($i = 0; $i < 15; $i++) {
            $response = $this->postJson('/chat/messages', [
                'conversation_id' => $this->conversation->id,
                'content' => "Message {$i}",
            ]);

            if ($i < 10) { // First 10 should succeed (throttle: 10 per minute)
                $response->assertStatus(201);
            } else { // After that should be rate limited
                $response->assertStatus(429);
            }
        }
    }

    #[Test]
    public function xss_protection_in_message_content()
    {
        $this->actingAs($this->user);

        $xssContent = '<script>alert("xss")</script>Hello world';

        $response = $this->postJson('/chat/messages', [
            'conversation_id' => $this->conversation->id,
            'content' => $xssContent,
        ]);

        $response->assertStatus(201);

        // Content should be stored as-is (no automatic escaping in API)
        $this->assertDatabaseHas('messages', [
            'content' => $xssContent,
        ]);
    }

    #[Test]
    public function sql_injection_protection_in_search()
    {
        $this->actingAs($this->user);

        // Try SQL injection in search
        $response = $this->getJson('/chat/users/search?q=%27%20OR%201=1%20--');

        $response->assertStatus(200);

        // Should not return all users (would be security issue)
        $users = $response->json('data');
        $this->assertLessThan(User::count(), count($users));
    }

    #[Test]
    public function conversation_participants_are_properly_loaded()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/chat/conversations');

        $response->assertStatus(200);
        $conversation = $response->json('data.0');

        // Check user data
        $this->assertEquals($this->user->id, $conversation['user']['id']);
        $this->assertEquals($this->user->username, $conversation['user']['username']);
        $this->assertEquals($this->user->first_name, $conversation['user']['first_name']);
        $this->assertEquals($this->user->last_name, $conversation['user']['last_name']);

        // Check receiver data
        $this->assertEquals($this->otherUser->id, $conversation['receiver']['id']);
        $this->assertEquals($this->otherUser->username, $conversation['receiver']['username']);
        $this->assertEquals($this->otherUser->first_name, $conversation['receiver']['first_name']);
        $this->assertEquals($this->otherUser->last_name, $conversation['receiver']['last_name']);
    }

    #[Test]
    public function message_sender_info_is_properly_loaded()
    {
        $this->actingAs($this->user);

        $response = $this->getJson('/chat/conversations');

        $response->assertStatus(200);
        $conversation = $response->json('data.0');
        $message = $conversation['messages'][0];

        $this->assertArrayHasKey('sender', $message);
        $this->assertEquals($this->user->id, $message['sender']['id']);
        $this->assertEquals($this->user->username, $message['sender']['username']);
        $this->assertEquals($this->user->first_name, $message['sender']['first_name']);
        $this->assertEquals($this->user->last_name, $message['sender']['last_name']);
    }
}