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
        Schema::create('wishlist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wishlist_id')->constrained('wishlists')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products', 'product_id')->onDelete('cascade');
            $table->json('product_variant')->nullable(); // Store variant details when added
            $table->decimal('price_when_added', 10, 2)->nullable(); // Track price changes
            $table->text('note')->nullable(); // Personal note about the item
            $table->unsignedInteger('priority')->default(0); // User-defined priority
            $table->boolean('notify_price_drop')->default(false);
            $table->boolean('notify_back_in_stock')->default(false);
            $table->timestamp('notified_at')->nullable(); // Last notification sent
            $table->timestamps();
            
            // Prevent duplicate items in same wishlist
            $table->unique(['wishlist_id', 'product_id']);
            
            // Indexes
            $table->index(['wishlist_id', 'priority']);
            $table->index(['product_id', 'created_at']);
            $table->index(['notify_price_drop', 'notify_back_in_stock']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wishlist_items');
    }
};
