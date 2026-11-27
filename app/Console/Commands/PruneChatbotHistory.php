<?php

namespace App\Console\Commands;

use App\Models\ChatMessage;
use App\Models\ChatRoom;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class PruneChatbotHistory extends Command
{
    protected $signature = 'chatbot:prune
        {--days= : Số ngày giữ lịch sử (mặc định theo CHATBOT_RETENTION_DAYS)}
        {--dry-run : Chỉ đếm số tin nhắn sẽ xoá}';

    protected $description = 'Xoá lịch sử chatbot cũ hơn thời gian lưu trữ cấu hình';

    public function handle(): int
    {
        $days = (int) ($this->option('days') ?: config('services.chatbot.retention_days', 90));

        if ($days < 1) {
            $this->error('Số ngày lưu trữ phải lớn hơn hoặc bằng 1.');

            return self::FAILURE;
        }

        $query = ChatMessage::query()
            ->where('created_at', '<', Carbon::now()->subDays($days))
            ->whereIn('chat_room_id', ChatRoom::query()
                ->where('room_name', 'like', 'chatbot:%')
                ->select('chat_room_id'));

        $count = (clone $query)->count();

        if ($this->option('dry-run')) {
            $this->info("Sẽ xoá {$count} tin nhắn chatbot cũ hơn {$days} ngày.");

            return self::SUCCESS;
        }

        $deleted = $query->delete();

        $this->info("Đã xoá {$deleted} tin nhắn chatbot cũ hơn {$days} ngày.");

        return self::SUCCESS;
    }
}
