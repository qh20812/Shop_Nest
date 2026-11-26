<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_promotion', function (Blueprint $table) {
            $table->unsignedBigInteger('promotion_code_id')->nullable()->after('promotion_id')->index();
            $table->timestamp('recorded_at')->nullable()->after('discount_applied');
            $table->timestamp('released_at')->nullable()->after('recorded_at');
        });
    }

    public function down(): void
    {
        Schema::table('order_promotion', function (Blueprint $table) {
            $table->dropColumn(['promotion_code_id', 'recorded_at', 'released_at']);
        });
    }
};
