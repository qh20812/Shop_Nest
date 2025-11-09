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
        // First, modify the column to be ENUM
        Schema::table('disputes', function (Blueprint $table) {
            $table->enum('status', DisputeStatus::values())
                ->default('open')
                ->comment('Dispute status using ENUM values')
                ->change();
        });

        // Then, migrate existing integer status values to their string equivalents
        DB::statement("UPDATE disputes SET status = 'open' WHERE status = 1");
        DB::statement("UPDATE disputes SET status = 'under_review' WHERE status = 2");
        DB::statement("UPDATE disputes SET status = 'resolved' WHERE status = 3");
        DB::statement("UPDATE disputes SET status = 'closed' WHERE status = 4");

        // Handle any invalid or unexpected status values
        DB::statement("UPDATE disputes SET status = 'open' WHERE status NOT IN ('open', 'under_review', 'resolved', 'closed')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert enum strings back to integers for rollback
        DB::statement("UPDATE disputes SET status = 1 WHERE status = 'open'");
        DB::statement("UPDATE disputes SET status = 2 WHERE status = 'under_review'");
        DB::statement("UPDATE disputes SET status = 3 WHERE status = 'resolved'");
        DB::statement("UPDATE disputes SET status = 4 WHERE status = 'closed'");

        // Change column back to integer
        Schema::table('disputes', function (Blueprint $table) {
            $table->tinyInteger('status')
                ->default(1)
                ->comment('1: Open, 2: Under Review, 3: Resolved, 4: Closed')
                ->change();
        });
    }
};
