<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Broadcast a newly created chat message.
 */
class MessageCreated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $message;
    public string $connection = 'reverb';

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        $this->message = $message->loadMissing('sender:id,username,first_name,last_name');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [new PrivateChannel('chat.' . $this->message->conversation_id)];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'message.created';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'conversation_id' => $this->message->conversation_id,
            'sender_id' => $this->message->sender_id,
            'content' => $this->message->content,
            'created_at' => optional($this->message->created_at)->toIso8601String(),
            'updated_at' => optional($this->message->updated_at)->toIso8601String(),
            'sender' => [
                'id' => $this->message->sender->id,
                'username' => $this->message->sender->username,
                'first_name' => $this->message->sender->first_name,
                'last_name' => $this->message->sender->last_name,
            ],
        ];
    }
}