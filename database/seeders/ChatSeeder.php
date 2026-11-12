<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
        // Query customers với role 'Customer'
        $users = User::whereHas('roles', function ($query) {
            $query->where('name->en', 'Customer');
        })->take(5)->get();

        // Query sellers với role 'Seller'
        $sellers = User::whereHas('roles', function ($query) {
            $query->where('name->en', 'Seller');
        })->take(3)->get();

        if ($users->isEmpty() || $sellers->isEmpty()) {
            $this->command->info('Không đủ users (customers) hoặc sellers để seed chat data. Users found: ' . $users->count() . ', Sellers found: ' . $sellers->count());
            return;
        }

        // Tạo conversations
        foreach ($users as $user) {
            foreach ($sellers as $seller) {
                    Conversation::firstOrCreate([
                        'user_id' => $user->id,
                        'receiver_id' => $seller->id,
                ]);
            }
        }

        // Tạo messages
        $conversations = Conversation::all();
        foreach ($conversations as $conversation) {
            for ($i = 0; $i < rand(5, 15); $i++) {
                Message::create([
                    'conversation_id' => $conversation->id,
                        'sender_id' => rand(0, 1) ? $conversation->user_id : $conversation->receiver_id,
                    'content' => 'Tin nhắn mẫu ' . ($i + 1),
                ]);
            }
        }

        $this->command->info('Chat data seeded successfully');
    }
}