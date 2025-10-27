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
        Schema::create('shipper_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders', 'order_id')->onDelete('cascade');
            $table->foreignId('shipper_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned(); // 1-5 stars
            $table->text('comment')->nullable();
            $table->json('criteria_ratings')->nullable(); // JSON for detailed ratings
            $table->boolean('is_anonymous')->default(false);
            $table->timestamp('rated_at');
            $table->timestamps();

            // Note: Rating validation will be handled at application level (1-5 stars)
            
            // Indexes for performance
            $table->index(['shipper_id', 'rating']);
            $table->index(['customer_id', 'rated_at']);
            $table->index(['order_id']);
            
            // Prevent duplicate ratings per order
            $table->unique(['order_id', 'customer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipper_ratings');
    }
};
