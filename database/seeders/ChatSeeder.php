<?php

namespace Database\Seeders;

use App\Models\ChatRoom;
use App\Models\Role;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Role::where('name', 'Customer')->first()->users;
        $sellers = Role::where('name', 'Seller')->first()->users;

        // Tạo 50 phòng chat giữa khách hàng và người bán
        for ($i = 0; $i < 50; $i++) {
            $customer = $customers->random();
            $seller = $sellers->random();

            $room = ChatRoom::create([
                'room_name' => "Chat between {$customer->username} and {$seller->username}",
                'type' => 2, // User-to-Seller
            ]);

            // Thêm người tham gia
            $room->participants()->create(['user_id' => $customer->id]);
            $room->participants()->create(['user_id' => $seller->id]);

            // Tạo tin nhắn
            $room->messages()->create([
                'sender_id' => $customer->id,
                'content' => 'Chào shop, cho mình hỏi sản phẩm này còn hàng không?',
            ]);
            $room->messages()->create([
                'sender_id' => $seller->id,
                'content' => 'Chào bạn, sản phẩm này bên mình vẫn còn hàng ạ. Bạn đặt hàng nhé.',
            ]);
        }
    }
}