<?php

namespace Database\Seeders;

use App\Models\ChatRoom;
use App\Models\Role;
use Illuminate\Database\Seeder;

class ChatSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Role::where('name->en', 'Customer')->first()?->users; // Sửa ở đây
        $sellers = Role::where('name->en', 'Seller')->first()?->users; // Sửa ở đây

        // Tạo 50 phòng chat giữa khách hàng và người bán
        for ($i = 0; $i < 50; $i++) {
            $customer = $customers->random();
            $seller = $sellers->random();

            $room = ChatRoom::create([
                'room_name' => "Chat between {$customer->username} and {$seller->username}",
                'type' => 2, // User-to-Seller
            ]);

            // Thêm người tham gia
            $room->participants()->create([
                'user_id' => $customer->id,
                'joined_at' => now(),
            ]);
            
            $room->participants()->create([
                'user_id' => $seller->id,
                'joined_at' => now(),
            ]);
            

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