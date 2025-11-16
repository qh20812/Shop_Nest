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
        // First, modify the column to use ENUM type
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('payment_status', ['unpaid', 'paid', 'failed', 'refunded'])
                  ->default('unpaid')
                  ->change();
        });

        // Then, migrate existing data from integers to enum strings
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
        DB::statement("UPDATE orders SET payment_status = 0 WHERE payment_status = 'unpaid'");
        DB::statement("UPDATE orders SET payment_status = 1 WHERE payment_status = 'paid'");
        DB::statement("UPDATE orders SET payment_status = 2 WHERE payment_status = 'failed'");
        DB::statement("UPDATE orders SET payment_status = 3 WHERE payment_status = 'refunded'");
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
            DB::statement("UPDATE orders SET payment_status = ? WHERE payment_status = ?", [$newValue, $oldValue]);
        }

        // Handle any null or invalid values
        DB::statement("UPDATE orders SET payment_status = 'unpaid' WHERE payment_status NOT IN ('unpaid', 'paid', 'failed', 'refunded') OR payment_status IS NULL");
    }
};
