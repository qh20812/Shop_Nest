<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attributes', function (Blueprint $table) {
            $table->id('attribute_id');
            $table->string('name')->unique()->comment('e.g., Color, Size, Storage');
        });

        Schema::create('attribute_values', function (Blueprint $table) {
            $table->id('attribute_value_id');
            $table->foreignId('attribute_id')->constrained('attributes', 'attribute_id')->onDelete('cascade');
            $table->string('value')->comment('e.g., Red, Large, 256GB');
        });

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id('variant_id');
            $table->foreignId('product_id')->constrained('products', 'product_id')->onDelete('cascade');
            $table->string('sku', 100)->unique();
            $table->decimal('price', 18, 2);
            $table->decimal('discount_price', 18, 2)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->foreignId('image_id')->nullable()->constrained('product_images', 'image_id')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('attribute_value_product_variant', function (Blueprint $table) {
            $table->primary(['product_variant_id', 'attribute_value_id']);
            $table->foreignId('product_variant_id')->constrained('product_variants', 'variant_id')->onDelete('cascade');
            $table->foreignId('attribute_value_id')->constrained('attribute_values', 'attribute_value_id')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attribute_value_product_variant');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('attribute_values');
        Schema::dropIfExists('attributes');
    }
};