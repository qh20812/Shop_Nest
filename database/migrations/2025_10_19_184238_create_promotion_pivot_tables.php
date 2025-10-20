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
        Schema::create('promotion_products', function (Blueprint $table) {
            $table->primary(['promotion_id', 'product_id']);
            $table->foreignId('promotion_id')->constrained('promotions', 'promotion_id')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products', 'product_id')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('promotion_categories', function (Blueprint $table) {
            $table->primary(['promotion_id', 'category_id']);
            $table->foreignId('promotion_id')->constrained('promotions', 'promotion_id')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories', 'category_id')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_categories');
        Schema::dropIfExists('promotion_products');
    }
};
