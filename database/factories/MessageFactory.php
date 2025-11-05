<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
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
        if (!$conversation) {
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