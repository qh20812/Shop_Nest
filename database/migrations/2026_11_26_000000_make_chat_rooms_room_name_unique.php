<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Gộp các room trùng tên (nếu có) trước khi thêm ràng buộc unique.
        $this->mergeDuplicateRooms();

        if (Schema::hasIndex('chat_rooms', 'chat_rooms_room_name_index')) {
            Schema::table('chat_rooms', function (Blueprint $table) {
                $table->dropIndex('chat_rooms_room_name_index');
            });
        }

        Schema::table('chat_rooms', function (Blueprint $table) {
            $table->unique('room_name', 'chat_rooms_room_name_unique');
        });
    }

    public function down(): void
    {
        if (Schema::hasIndex('chat_rooms', 'chat_rooms_room_name_unique')) {
            Schema::table('chat_rooms', function (Blueprint $table) {
                $table->dropUnique('chat_rooms_room_name_unique');
            });
        }

        if (! Schema::hasIndex('chat_rooms', 'chat_rooms_room_name_index')) {
            Schema::table('chat_rooms', function (Blueprint $table) {
                $table->index('room_name', 'chat_rooms_room_name_index');
            });
        }
    }

    /**
     * chat_rooms.room_name trước đây chỉ có index thường nên có thể tồn tại room
     * trùng. Giữ room có id nhỏ nhất, chuyển message/participant sang rồi xoá room dư.
     */
    private function mergeDuplicateRooms(): void
    {
        $duplicatedNames = DB::table('chat_rooms')
            ->select('room_name')
            ->groupBy('room_name')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('room_name');

        foreach ($duplicatedNames as $roomName) {
            $roomIds = DB::table('chat_rooms')
                ->where('room_name', $roomName)
                ->orderBy('chat_room_id')
                ->pluck('chat_room_id')
                ->all();

            $keeperId = array_shift($roomIds);

            foreach ($roomIds as $duplicateId) {
                DB::table('chat_messages')
                    ->where('chat_room_id', $duplicateId)
                    ->update(['chat_room_id' => $keeperId]);

                $participantIds = DB::table('chat_participants')
                    ->where('chat_room_id', $duplicateId)
                    ->pluck('chat_participant_id')
                    ->all();

                foreach ($participantIds as $participantId) {
                    $participant = DB::table('chat_participants')->where('chat_participant_id', $participantId)->first();

                    if (! $participant) {
                        continue;
                    }

                    $alreadyJoined = DB::table('chat_participants')
                        ->where('chat_room_id', $keeperId)
                        ->where('user_id', $participant->user_id)
                        ->exists();

                    if ($alreadyJoined) {
                        DB::table('chat_participants')->where('chat_participant_id', $participantId)->delete();
                    } else {
                        DB::table('chat_participants')
                            ->where('chat_participant_id', $participantId)
                            ->update(['chat_room_id' => $keeperId]);
                    }
                }

                DB::table('chat_rooms')->where('chat_room_id', $duplicateId)->delete();
            }
        }
    }
};
