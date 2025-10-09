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
        // Check if Shipper role exists, if not add it
        $shipperRoleExists = DB::table('roles')->where('name', 'Shipper')->exists();
        
        if (!$shipperRoleExists) {
            DB::table('roles')->insert([
                'name' => 'Shipper',
                'description' => 'Shipper role for delivery personnel',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove Shipper role
        DB::table('roles')->where('name', 'Shipper')->delete();
    }
};
