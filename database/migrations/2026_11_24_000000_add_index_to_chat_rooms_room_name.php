<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_rooms', function (Blueprint $table) {
            $table->index('room_name', 'chat_rooms_room_name_index');
        });
    }

    public function down(): void
    {
        Schema::table('chat_rooms', function (Blueprint $table) {
            $table->dropIndex('chat_rooms_room_name_index');
        });
    }
};
