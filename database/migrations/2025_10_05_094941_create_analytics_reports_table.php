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
        Schema::create('analytics_reports', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['revenue', 'orders', 'products', 'users', 'custom']);
            $table->enum('period_type', ['daily', 'weekly', 'monthly', 'yearly', 'custom']);
            $table->date('start_date');
            $table->date('end_date');
            $table->json('parameters')->nullable();
            $table->json('result_data')->nullable();
            $table->string('file_path')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->unsignedBigInteger('created_by');
            $table->timestamps();

            // Foreign keys
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index(['type', 'created_at']);
            $table->index(['status', 'created_at']);
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_reports');
    }
};
