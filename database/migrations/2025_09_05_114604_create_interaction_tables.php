<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id('review_id');
            $table->foreignId('product_id')->constrained('products', 'product_id')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned();
            $table->text('comment')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['product_id', 'user_id']);
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id('notification_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title', 200);
            $table->text('content');
            $table->tinyInteger('type')->comment('e.g., OrderUpdate, Promotion, System');
            $table->boolean('is_read')->default(false);
            $table->morphs('notifiable'); // Related entity (Order, Product, etc.)
            $table->string('action_url', 500)->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('reviews');
    }
};