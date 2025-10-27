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
        Schema::table('products', function (Blueprint $table) {
            // Add shop relationship for multi-vendor support
            $table->foreignId('shop_id')->nullable()->after('product_id')->constrained('shops', 'id')->onDelete('cascade');
            
            // Add index for shop-based queries
            $table->index(['shop_id', 'is_active', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['shop_id', 'is_active', 'created_at']);
            $table->dropForeign(['shop_id']);
            $table->dropColumn('shop_id');
        });
    }
};
