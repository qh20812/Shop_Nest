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
        // First, migrate existing integer status values to their string equivalents
        DB::table('returns')
            ->where('status', 1)
            ->update(['status' => 'pending']);
        
        DB::table('returns')
            ->where('status', 2)
            ->update(['status' => 'approved']);
        
        DB::table('returns')
            ->where('status', 3)
            ->update(['status' => 'rejected']);
        
        DB::table('returns')
            ->where('status', 4)
            ->update(['status' => 'refunded']);
        
        DB::table('returns')
            ->where('status', 5)
            ->update(['status' => 'exchanged']);
        
        DB::table('returns')
            ->where('status', 6)
            ->update(['status' => 'cancelled']);

        // Handle any invalid or unexpected status values
        DB::table('returns')
            ->whereNotIn('status', ['pending', 'approved', 'rejected', 'refunded', 'exchanged', 'cancelled'])
            ->update(['status' => 'pending']);

        // Now modify the column to be ENUM
        Schema::table('returns', function (Blueprint $table) {
            $table->enum('status', ReturnStatus::values())
                ->default('pending')
                ->comment('Return status using ENUM values')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert enum strings back to integers for rollback
        DB::table('returns')->where('status', 'pending')->update(['status' => 1]);
        DB::table('returns')->where('status', 'approved')->update(['status' => 2]);
        DB::table('returns')->where('status', 'rejected')->update(['status' => 3]);
        DB::table('returns')->where('status', 'refunded')->update(['status' => 4]);
        DB::table('returns')->where('status', 'exchanged')->update(['status' => 5]);
        DB::table('returns')->where('status', 'cancelled')->update(['status' => 6]);

        // Change column back to integer
        Schema::table('returns', function (Blueprint $table) {
            $table->tinyInteger('status')
                ->default(1)
                ->comment('1: Pending, 2: Approved, 3: Rejected, 4: Refunded, 5: Exchanged, 6: Cancelled')
                ->change();
        });
    }
};
