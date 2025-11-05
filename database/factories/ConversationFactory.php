<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conversation>
 */
class ConversationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = Conversation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::where('role', 'user')->inRandomOrder()->first();
    $receiver = User::where('role', 'seller')->inRandomOrder()->first();

        return [
            'user_id' => $user->id ?? User::factory()->create(['role' => 'user'])->id,
            'receiver_id' => $receiver->id ?? User::factory()->create(['role' => 'seller'])->id,
        ];
    }
}