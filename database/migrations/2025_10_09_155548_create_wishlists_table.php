<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name', 100)->default('My Wishlist');
            $table->text('description')->nullable();
            $table->enum('privacy', ['private', 'public', 'shared'])->default('private');
            $table->boolean('is_default')->default(false);
            $table->unsignedInteger('items_count')->default(0);
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'is_default']);
            $table->index(['privacy', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wishlists');
    }
};
