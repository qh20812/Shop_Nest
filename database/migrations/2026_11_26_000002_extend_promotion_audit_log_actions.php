<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const ACTIONS = [
        'created',
        'updated',
        'deleted',
        'activated',
        'deactivated',
        'applied',
        'auto_apply_enabled',
        'auto_apply_disabled',
    ];

    public function up(): void
    {
        Schema::table('promotion_audit_logs', function (Blueprint $table) {
            $table->enum('action', self::ACTIONS)->change();
        });
    }

    public function down(): void
    {
        DB::table('promotion_audit_logs')
            ->whereIn('action', ['auto_apply_enabled', 'auto_apply_disabled'])
            ->update(['action' => 'updated']);

        Schema::table('promotion_audit_logs', function (Blueprint $table) {
            $table->enum('action', [
                'created',
                'updated',
                'deleted',
                'activated',
                'deactivated',
                'applied',
            ])->change();
        });
    }
};
