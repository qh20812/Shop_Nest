<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Enums\ProductStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, modify the column to be ENUM
        Schema::table('products', function (Blueprint $table) {
            $table->enum('status', ProductStatus::values())
                ->default('draft')
                ->comment('Product status using ENUM values')
                ->change();
        });

        // Then, migrate existing integer status values to their string equivalents
        DB::statement("UPDATE products SET status = 'draft' WHERE status = 1");
        DB::statement("UPDATE products SET status = 'pending_approval' WHERE status = 2");
        DB::statement("UPDATE products SET status = 'published' WHERE status = 3");
        DB::statement("UPDATE products SET status = 'hidden' WHERE status = 4");

        // Handle any invalid or unexpected status values
        DB::statement("UPDATE products SET status = 'draft' WHERE status NOT IN ('draft', 'pending_approval', 'published', 'hidden')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert enum strings back to integers for rollback
        DB::statement("UPDATE products SET status = 1 WHERE status = 'draft'");
        DB::statement("UPDATE products SET status = 2 WHERE status = 'pending_approval'");
        DB::statement("UPDATE products SET status = 3 WHERE status = 'published'");
        DB::statement("UPDATE products SET status = 4 WHERE status = 'hidden'");

        // Change column back to integer
        Schema::table('products', function (Blueprint $table) {
            $table->tinyInteger('status')
                ->default(1)
                ->comment('1: Draft, 2: Pending Approval, 3: Published, 4: Hidden')
                ->change();
        });
    }
};
