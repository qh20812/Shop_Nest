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
        Schema::create('shipment_journeys', function (Blueprint $table) {
            $table->id('journey_id');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->enum('leg_type', ['first_mile', 'middle_mile', 'last_mile']);
            $table->foreignId('shipper_id')->nullable()->constrained('shipper_profiles', 'user_id')->onDelete('set null');
            $table->foreignId('start_hub_id')->nullable()->constrained('hubs', 'id')->onDelete('set null');
            $table->foreignId('end_hub_id')->nullable()->constrained('hubs', 'id')->onDelete('set null');
            $table->enum('status', ['pending', 'in_transit', 'completed', 'cancelled'])->default('pending');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['order_id', 'leg_type']);
            $table->index(['shipper_id', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipment_journeys');
    }
};
