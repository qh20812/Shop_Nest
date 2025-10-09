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
        Schema::table('product_variants', function (Blueprint $table) {
            // Add inventory management fields to product variants
            $table->unsignedInteger('reserved_quantity')->default(0)->after('stock_quantity');
            $table->unsignedInteger('available_quantity')->storedAs('stock_quantity - reserved_quantity')->after('reserved_quantity');
            $table->unsignedInteger('minimum_stock_level')->default(0)->after('available_quantity');
            $table->boolean('track_inventory')->default(true)->after('minimum_stock_level');
            $table->boolean('allow_backorder')->default(false)->after('track_inventory');
            $table->timestamp('last_restocked_at')->nullable()->after('allow_backorder');
            
            // Add indexes for inventory queries
            $table->index(['available_quantity', 'created_at']);
            $table->index(['minimum_stock_level', 'available_quantity']);
            $table->index('track_inventory');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropIndex(['available_quantity', 'created_at']);
            $table->dropIndex(['minimum_stock_level', 'available_quantity']);
            $table->dropIndex(['track_inventory']);
            
            $table->dropColumn([
                'reserved_quantity',
                'available_quantity',
                'minimum_stock_level',
                'track_inventory',
                'allow_backorder',
                'last_restocked_at'
            ]);
        });
    }
};
