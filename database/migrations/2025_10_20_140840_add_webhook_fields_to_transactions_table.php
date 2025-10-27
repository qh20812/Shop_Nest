<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('gateway_event_id')->nullable()->after('gateway_transaction_id');
            $table->json('raw_payload')->nullable()->after('status');
            $table->index('gateway_event_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('transactions_gateway_event_id_index');
            $table->dropColumn(['raw_payload', 'gateway_event_id']);
        });
    }
};
