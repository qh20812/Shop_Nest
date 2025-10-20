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
        Schema::create('promotion_performance_metrics', function (Blueprint $table) {
            $table->bigIncrements('metric_id');
            $table->foreignId('promotion_id')->constrained('promotions', 'promotion_id')->cascadeOnDelete();
            $table->date('date');
            $table->unsignedInteger('impressions')->default(0);
            $table->unsignedInteger('clicks')->default(0);
            $table->unsignedInteger('conversions')->default(0);
            $table->decimal('revenue', 18, 2)->default(0);
            $table->decimal('cost', 18, 2)->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();

            $table->unique(['promotion_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_performance_metrics');
    }
};
