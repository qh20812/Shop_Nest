<?php

namespace Tests\Feature;

use App\Models\ChatMessage;
use App\Models\ChatRoom;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChatbotPruneCommandTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function prunes_only_old_chatbot_messages(): void
    {
        $user = User::factory()->create();

        $chatbotRoom = ChatRoom::create([
            'room_name' => 'chatbot:'.$user->id.':customer',
            'type' => 3,
            'is_active' => true,
        ]);

        $supportRoom = ChatRoom::create([
            'room_name' => 'user:'.$user->id.':seller:1',
            'type' => 1,
            'is_active' => true,
        ]);

        $oldChatbotMessage = $this->createMessage($chatbotRoom, $user, now()->subDays(120));
        $recentChatbotMessage = $this->createMessage($chatbotRoom, $user, now()->subDays(5));
        $oldSupportMessage = $this->createMessage($supportRoom, $user, now()->subDays(120));

        $this->artisan('chatbot:prune', ['--dry-run' => true])
            ->expectsOutputToContain('Sẽ xoá 1 tin nhắn')
            ->assertSuccessful();

        $this->assertDatabaseHas('chat_messages', ['chat_message_id' => $oldChatbotMessage->chat_message_id]);

        $this->artisan('chatbot:prune')->assertSuccessful();

        $this->assertDatabaseMissing('chat_messages', ['chat_message_id' => $oldChatbotMessage->chat_message_id]);
        $this->assertDatabaseHas('chat_messages', ['chat_message_id' => $recentChatbotMessage->chat_message_id]);
        $this->assertDatabaseHas('chat_messages', ['chat_message_id' => $oldSupportMessage->chat_message_id]);
    }

    #[Test]
    public function deleting_a_user_keeps_their_chat_messages(): void
    {
        $user = User::factory()->create();

        $room = ChatRoom::create([
            'room_name' => 'chatbot:'.$user->id.':customer',
            'type' => 3,
            'is_active' => true,
        ]);

        $message = $this->createMessage($room, $user, now());

        $user->delete();

        $this->assertDatabaseHas('chat_messages', [
            'chat_message_id' => $message->chat_message_id,
            'sender_id' => null,
        ]);
    }

    private function createMessage(ChatRoom $room, User $user, Carbon $createdAt): ChatMessage
    {
        $message = ChatMessage::create([
            'chat_room_id' => $room->chat_room_id,
            'sender_id' => $user->id,
            'content' => 'Tin nhắn thử',
            'assistant_content' => 'Trả lời thử',
        ]);

        ChatMessage::query()
            ->whereKey($message->chat_message_id)
            ->update(['created_at' => $createdAt, 'updated_at' => $createdAt]);

        return $message;
    }
}
