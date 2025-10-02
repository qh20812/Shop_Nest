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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('currency', 3)
                ->default('VND')
                ->after('total_amount')
                ->comment('Mã tiền tệ của đơn hàng (VND, USD, etc.)');
            
            $table->decimal('exchange_rate', 12, 6)
                ->default(1.000000)
                ->after('currency')
                ->comment('Tỉ giá so với đơn vị tiền tệ cơ sở tại thời điểm đặt hàng');
            
            $table->decimal('total_amount_base', 18, 2)
                ->nullable()
                ->after('exchange_rate')
                ->comment('Tổng giá trị đơn hàng đã quy đổi về đơn vị tiền tệ cơ sở (e.g., USD)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'total_amount_base',
                'exchange_rate',
                'currency'
            ]);
        });
    }
};
