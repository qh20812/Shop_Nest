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
        // For MySQL, use MODIFY COLUMN
        if (DB::getDriverName() === 'mysql') {
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
        } else {
            // For SQLite and other databases, drop and recreate column
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('status');
            });
            Schema::table('orders', function (Blueprint $table) {
                $table->enum('status', [
                    'pending_confirmation',
                    'processing',
                    'pending_assignment',
                    'assigned_to_shipper',
                    'delivering',
                    'delivered',
                    'completed',
                    'cancelled',
                    'returned'
                ])->default('pending_confirmation');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enum values
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM(
                'pending',
                'confirmed',
                'processing',
                'delivered',
                'cancelled',
                'refunded'
            ) NOT NULL DEFAULT 'pending'");
        } else {
            // For SQLite and other databases, drop and recreate column
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('status');
            });
            Schema::table('orders', function (Blueprint $table) {
                $table->enum('status', [
                    'pending',
                    'confirmed',
                    'processing',
                    'delivered',
                    'cancelled',
                    'refunded'
                ])->default('pending');
            });
        }
    }
};
