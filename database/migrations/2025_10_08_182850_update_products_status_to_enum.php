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
        // First, migrate existing integer status values to their string equivalents
        DB::table('products')
            ->where('status', 1)
            ->update(['status' => 'draft']);
        
        DB::table('products')
            ->where('status', 2)
            ->update(['status' => 'pending_approval']);
        
        DB::table('products')
            ->where('status', 3)
            ->update(['status' => 'published']);
        
        DB::table('products')
            ->where('status', 4)
            ->update(['status' => 'hidden']);

        // Handle any invalid or unexpected status values
        DB::table('products')
            ->whereNotIn('status', ['draft', 'pending_approval', 'published', 'hidden'])
            ->update(['status' => 'draft']);

        // Now modify the column to be ENUM
        Schema::table('products', function (Blueprint $table) {
            $table->enum('status', ProductStatus::values())
                ->default('draft')
                ->comment('Product status using ENUM values')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert enum strings back to integers for rollback
        DB::table('products')->where('status', 'draft')->update(['status' => 1]);
        DB::table('products')->where('status', 'pending_approval')->update(['status' => 2]);
        DB::table('products')->where('status', 'published')->update(['status' => 3]);
        DB::table('products')->where('status', 'hidden')->update(['status' => 4]);

        // Change column back to integer
        Schema::table('products', function (Blueprint $table) {
            $table->tinyInteger('status')
                ->default(1)
                ->comment('1: Draft, 2: Pending Approval, 3: Published, 4: Hidden')
                ->change();
        });
    }
};
