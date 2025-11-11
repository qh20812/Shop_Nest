<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1️⃣ Đầu tiên đổi cột sang ENUM
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('payment_status', ['unpaid', 'paid', 'failed', 'refunded'])
                ->default('unpaid')
                ->change();
        });

        // 2️⃣ Sau đó migrate dữ liệu
        $this->migrateExistingPaymentStatusData();
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert back to integer
        Schema::table('orders', function (Blueprint $table) {
            $table->tinyInteger('payment_status')->default(0)->change();
        });

        // Restore integer values
        DB::table('orders')->where('payment_status', 'unpaid')->update(['payment_status' => 0]);
        DB::table('orders')->where('payment_status', 'paid')->update(['payment_status' => 1]);
        DB::table('orders')->where('payment_status', 'failed')->update(['payment_status' => 2]);
        DB::table('orders')->where('payment_status', 'refunded')->update(['payment_status' => 3]);
    }

    /**
     * Migrate existing integer payment status values to enum strings
     */
    private function migrateExistingPaymentStatusData(): void
    {
        // Mapping from old integer values to new enum strings
        $mappings = [
            0 => 'unpaid',
            1 => 'paid',
            2 => 'failed',
            3 => 'refunded',
        ];

        foreach ($mappings as $oldValue => $newValue) {
            DB::table('orders')
                ->where('payment_status', $oldValue)
                ->update(['payment_status' => $newValue]);
        }

        // Handle any null or invalid values
        DB::table('orders')
            ->whereNotIn('payment_status', ['unpaid', 'paid', 'failed', 'refunded'])
            ->orWhereNull('payment_status')
            ->update(['payment_status' => 'unpaid']);
    }
};
