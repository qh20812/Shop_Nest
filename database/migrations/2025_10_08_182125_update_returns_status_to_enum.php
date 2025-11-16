<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Enums\ReturnStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, modify the column to be ENUM
        Schema::table('returns', function (Blueprint $table) {
            $table->enum('status', ReturnStatus::values())
                ->default('pending')
                ->comment('Return status using ENUM values')
                ->change();
        });

        // Then, migrate existing integer status values to their string equivalents
        DB::statement("UPDATE returns SET status = 'pending' WHERE status = 1");
        DB::statement("UPDATE returns SET status = 'approved' WHERE status = 2");
        DB::statement("UPDATE returns SET status = 'rejected' WHERE status = 3");
        DB::statement("UPDATE returns SET status = 'refunded' WHERE status = 4");
        DB::statement("UPDATE returns SET status = 'exchanged' WHERE status = 5");
        DB::statement("UPDATE returns SET status = 'cancelled' WHERE status = 6");

        // Handle any invalid or unexpected status values
        DB::statement("UPDATE returns SET status = 'pending' WHERE status NOT IN ('pending', 'approved', 'rejected', 'refunded', 'exchanged', 'cancelled')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert enum strings back to integers for rollback
        DB::statement("UPDATE returns SET status = 1 WHERE status = 'pending'");
        DB::statement("UPDATE returns SET status = 2 WHERE status = 'approved'");
        DB::statement("UPDATE returns SET status = 3 WHERE status = 'rejected'");
        DB::statement("UPDATE returns SET status = 4 WHERE status = 'refunded'");
        DB::statement("UPDATE returns SET status = 5 WHERE status = 'exchanged'");
        DB::statement("UPDATE returns SET status = 6 WHERE status = 'cancelled'");

        // Convert back to integer
        Schema::table('returns', function (Blueprint $table) {
            $table->tinyInteger('status')
                ->default(1)
                ->comment('1: Pending, 2: Approved, 3: Rejected, 4: Refunded, 5: Exchanged, 6: Cancelled')
                ->change();
        });
    }
};
