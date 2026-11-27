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
            $this->command->info('Không đủ users (customers) hoặc sellers để seed chat data. Users found: '.$users->count().', Sellers found: '.$sellers->count());

            return;
        }

        if (Message::query()->exists()) {
            $this->command->info('Chat data already seeded, skipping.');

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
        $templates = [
            'Chào shop, sản phẩm này còn hàng không ạ?',
            'Dạ còn hàng bạn nhé, shop giao trong 2-3 ngày.',
            'Mình muốn hỏi thêm về bảo hành và đổi trả.',
            'Sản phẩm bảo hành 12 tháng, đổi trả trong 7 ngày nếu lỗi nhà sản xuất ạ.',
            'Cảm ơn shop, mình sẽ đặt hàng ngay.',
            'Shop có hỗ trợ miễn phí vận chuyển không?',
            'Đơn từ 300.000đ shop miễn phí giao hàng nội thành nhé.',
        ];

        foreach ($conversations as $conversation) {
            $messageCount = rand(4, 8);

            for ($i = 0; $i < $messageCount; $i++) {
                $message = Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $i % 2 === 0 ? $conversation->user_id : $conversation->receiver_id,
                    'content' => $templates[$i % count($templates)],
                ]);

                $message->forceFill([
                    'created_at' => now()->subMinutes(($messageCount - $i) * 3),
                    'updated_at' => now()->subMinutes(($messageCount - $i) * 3),
                ])->save();
            }
        }

        $this->command->info('Chat data seeded successfully');
    }
}
