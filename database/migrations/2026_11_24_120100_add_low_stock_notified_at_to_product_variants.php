<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('product_variants', 'low_stock_notified_at')) {
            return;
        }

        Schema::table('product_variants', function (Blueprint $table) {
            $table->timestamp('low_stock_notified_at')->nullable();
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('product_variants', 'low_stock_notified_at')) {
            return;
        }

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn('low_stock_notified_at');
        });
    }
};
