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
        Schema::create('flash_sale_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flash_sale_event_id')
                  ->constrained('flash_sale_events')
                  ->onDelete('cascade')
                  ->comment('ID sự kiện Flash Sale');
            $table->foreignId('product_variant_id')
                  ->constrained('product_variants', 'variant_id')
                  ->onDelete('cascade')
                  ->comment('ID biến thể sản phẩm');
            $table->decimal('flash_sale_price', 15, 2)
                  ->comment('Giá Flash Sale của sản phẩm');
            $table->integer('quantity_limit')
                  ->default(0)
                  ->comment('Số lượng giới hạn cho Flash Sale');
            $table->integer('sold_count')
                  ->default(0)
                  ->comment('Số lượng đã bán trong Flash Sale');
            $table->decimal('discount_percentage', 5, 2)
                  ->nullable()
                  ->comment('Phần trăm giảm giá so với giá gốc');
            $table->integer('max_quantity_per_user')
                  ->default(1)
                  ->comment('Số lượng tối đa mỗi người dùng có thể mua');
            $table->json('metadata')->nullable()->comment('Dữ liệu bổ sung (JSON)');
            $table->timestamps();

            // Composite unique constraint
            $table->unique(['flash_sale_event_id', 'product_variant_id'], 'flash_sale_event_product_unique');
            
            // Indexes for performance
            $table->index(['flash_sale_event_id', 'sold_count'], 'flash_sale_products_event_sold_index');
            $table->index(['product_variant_id'], 'flash_sale_products_variant_index');
            $table->index(['flash_sale_price'], 'flash_sale_products_price_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flash_sale_products');
    }
};
