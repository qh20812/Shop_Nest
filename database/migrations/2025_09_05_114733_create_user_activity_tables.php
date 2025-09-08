<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id('user_preference_id');
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('preferred_category_id')->nullable()->constrained('categories', 'category_id')->onDelete('set null');
            $table->foreignId('preferred_brand_id')->nullable()->constrained('brands', 'brand_id')->onDelete('set null');
            $table->decimal('min_price_range', 18, 2)->nullable();
            $table->decimal('max_price_range', 18, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('product_views', function (Blueprint $table) {
            $table->id('product_view_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products', 'product_id')->onDelete('cascade');
            $table->integer('view_count')->default(1);
            $table->timestamp('last_viewed');
            
            $table->unique(['user_id', 'product_id']);
        });

        Schema::create('search_histories', function (Blueprint $table) {
            $table->id('search_history_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('search_term', 200);
            $table->integer('search_count')->default(1);
            $table->timestamp('last_searched');
            
            $table->unique(['user_id', 'search_term']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('search_histories');
        Schema::dropIfExists('product_views');
        Schema::dropIfExists('user_preferences');
    }
};