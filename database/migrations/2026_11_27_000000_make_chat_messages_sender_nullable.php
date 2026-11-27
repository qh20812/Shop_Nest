<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Giữ lại tin nhắn khi user bị xoá cứng; sender_id chuyển thành NULL.
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropForeign(['sender_id']);
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->unsignedBigInteger('sender_id')->nullable()->change();
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->foreign('sender_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->dropForeign(['sender_id']);
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->unsignedBigInteger('sender_id')->nullable(false)->change();
        });

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->foreign('sender_id')->references('id')->on('users')->restrictOnDelete();
        });
    }
};
