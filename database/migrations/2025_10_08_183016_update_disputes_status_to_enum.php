<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Enums\DisputeStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, migrate existing integer status values to their string equivalents
        DB::table('disputes')
            ->where('status', 1)
            ->update(['status' => 'open']);
        
        DB::table('disputes')
            ->where('status', 2)
            ->update(['status' => 'under_review']);
        
        DB::table('disputes')
            ->where('status', 3)
            ->update(['status' => 'resolved']);
        
        DB::table('disputes')
            ->where('status', 4)
            ->update(['status' => 'closed']);

        // Handle any invalid or unexpected status values
        DB::table('disputes')
            ->whereNotIn('status', ['open', 'under_review', 'resolved', 'closed'])
            ->update(['status' => 'open']);

        // Now modify the column to be ENUM
        Schema::table('disputes', function (Blueprint $table) {
            $table->enum('status', DisputeStatus::values())
                ->default('open')
                ->comment('Dispute status using ENUM values')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert enum strings back to integers for rollback
        DB::table('disputes')->where('status', 'open')->update(['status' => 1]);
        DB::table('disputes')->where('status', 'under_review')->update(['status' => 2]);
        DB::table('disputes')->where('status', 'resolved')->update(['status' => 3]);
        DB::table('disputes')->where('status', 'closed')->update(['status' => 4]);

        // Change column back to integer
        Schema::table('disputes', function (Blueprint $table) {
            $table->tinyInteger('status')
                ->default(1)
                ->comment('1: Open, 2: Under Review, 3: Resolved, 4: Closed')
                ->change();
        });
    }
};
