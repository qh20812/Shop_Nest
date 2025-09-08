<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_rooms', function (Blueprint $table) {
            $table->id('chat_room_id');
            $table->string('room_name', 100);
            $table->tinyInteger('type')->comment('1: User-to-User, 2: User-to-Seller');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('chat_participants', function (Blueprint $table) {
            $table->id('chat_participant_id');
            $table->foreignId('chat_room_id')->constrained('chat_rooms', 'chat_room_id')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('joined_at');
            $table->timestamp('left_at')->nullable();
            
            $table->unique(['chat_room_id', 'user_id']);
        });

        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id('chat_message_id');
            $table->foreignId('chat_room_id')->constrained('chat_rooms', 'chat_room_id')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users');
            $table->text('content');
            $table->tinyInteger('content_type')->default(1)->comment('1: Text, 2: Image, 3: File');
            $table->string('attachment_url', 500)->nullable();
            $table->boolean('is_edited')->default(false);
            $table->timestamp('edited_at')->nullable();
            $table->timestamps();
        });

        Schema::create('disputes', function (Blueprint $table) {
            $table->id('dispute_id');
            $table->foreignId('order_id')->constrained('orders', 'order_id');
            $table->foreignId('customer_id')->constrained('users');
            $table->foreignId('seller_id')->constrained('users');
            $table->string('subject', 200);
            $table->text('description');
            $table->tinyInteger('status')->comment('1: Open, 2: Under Review, 3: Resolved, 4: Closed');
            $table->tinyInteger('type')->comment('1: Item not received, 2: Item not as described, 3: Other');
            $table->foreignId('assigned_admin_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('resolution')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });

        Schema::create('dispute_messages', function (Blueprint $table) {
            $table->id('dispute_message_id');
            $table->foreignId('dispute_id')->constrained('disputes', 'dispute_id')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users');
            $table->text('content');
            $table->string('attachment_url', 500)->nullable();
            $table->boolean('is_admin_message')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dispute_messages');
        Schema::dropIfExists('disputes');
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_participants');
        Schema::dropIfExists('chat_rooms');
    }
};