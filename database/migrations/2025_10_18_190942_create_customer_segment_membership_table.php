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
        Schema::create('customer_segment_membership', function (Blueprint $table) {
            $table->bigIncrements('membership_id');
            $table->foreignId('segment_id')->constrained('customer_segments', 'segment_id')->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->timestamp('joined_at')->useCurrent();

            $table->unique(['segment_id', 'customer_id']);
            $table->index('customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_segment_membership');
    }
};
