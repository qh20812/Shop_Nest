<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->index('sku', 'product_variants_sku_index');
            $table->index('stock_quantity', 'product_variants_stock_quantity_index');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->index('seller_id', 'products_seller_id_index');
            $table->index('category_id', 'products_category_id_index');
            $table->index('brand_id', 'products_brand_id_index');
        });
    }

    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropIndex('product_variants_sku_index');
            $table->dropIndex('product_variants_stock_quantity_index');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_seller_id_index');
            $table->dropIndex('products_category_id_index');
            $table->dropIndex('products_brand_id_index');
        });
    }
};
