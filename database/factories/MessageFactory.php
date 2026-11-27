<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends Factory<Message>
 */
class MessageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<Model>
     */
    protected $model = Message::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $conversation = Conversation::inRandomOrder()->first();
        if (! $conversation) {
            $conversation = Conversation::factory()->create();
        }

        $sender = $this->faker->randomElement([$conversation->user_id, $conversation->receiver_id]);

        return [
            'conversation_id' => $conversation->id,
            'sender_id' => $sender,
            'content' => $this->faker->sentence(),
        ];
    }
}
