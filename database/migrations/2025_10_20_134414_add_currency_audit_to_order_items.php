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
        Schema::table('order_items', function (Blueprint $table) {
            $table->string('original_currency', 3)->default('VND')->after('total_price');
            $table->decimal('original_unit_price', 15, 2)->default(0)->after('original_currency');
            $table->decimal('original_total_price', 15, 2)->default(0)->after('original_unit_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['original_currency', 'original_unit_price', 'original_total_price']);
        });
    }
};
