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
        // First, update any existing data to ensure valid enum values
        $this->migrateExistingData();
        
        // Then modify the column to use ENUM  
        Schema::table('orders', function (Blueprint $table) {
            // Drop the existing string status column
            $table->dropColumn('status');
        });
        
        // Add the new ENUM status column
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
            ])->default('pending_confirmation')->after('total_amount')
            ->comment('Order status using ENUM values');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Drop the ENUM status column
            $table->dropColumn('status');
        });
        
        // Re-add the string status column
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('pending_confirmation')->after('total_amount')
                ->comment('Statuses: pending_confirmation, processing, pending_assignment, assigned_to_shipper, delivering, delivered, completed, cancelled, returned');
        });
    }

    /**
     * Migrate existing data to ensure valid enum values
     */
    private function migrateExistingData(): void
    {
        // Update any invalid or legacy status values to valid enum values
        DB::table('orders')->where('status', '')->update(['status' => 'pending_confirmation']);
        DB::table('orders')->whereNull('status')->update(['status' => 'pending_confirmation']);
        
        // Map any legacy integer values to new enum values (if any exist)
        $legacyMappings = [
            '0' => 'pending_confirmation',
            '1' => 'processing',
            '2' => 'delivering',
            '3' => 'delivered',
            '4' => 'cancelled',
            'pending' => 'pending_confirmation',
            'shipped' => 'delivering',
        ];
        
        foreach ($legacyMappings as $oldValue => $newValue) {
            DB::table('orders')->where('status', $oldValue)->update(['status' => $newValue]);
        }
        
        // Ensure all remaining status values are valid enum values
        $validStatuses = [
            'pending_confirmation',
            'processing',
            'pending_assignment', 
            'assigned_to_shipper',
            'delivering',
            'delivered',
            'completed',
            'cancelled',
            'returned'
        ];
        
        // Update any invalid status to default
        DB::table('orders')->whereNotIn('status', $validStatuses)->update(['status' => 'pending_confirmation']);
    }
};
