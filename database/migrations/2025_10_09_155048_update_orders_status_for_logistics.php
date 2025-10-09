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
        // First, let's modify the enum to include new logistics statuses
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM(
            'pending_confirmation', 
            'processing', 
            'pending_assignment',
            'assigned_to_shipper',
            'delivering',
            'delivered', 
            'completed',
            'cancelled', 
            'returned'
        ) NOT NULL DEFAULT 'pending_confirmation'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enum values
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM(
            'pending', 
            'confirmed', 
            'processing', 
            'delivered', 
            'cancelled', 
            'refunded'
        ) NOT NULL DEFAULT 'pending'");
    }
};
