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
        Schema::create('product_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('product_questions')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('answer');
            $table->enum('user_type', ['customer', 'seller', 'admin'])->default('customer');
            $table->boolean('is_verified')->default(false); // Verified by seller/admin
            $table->boolean('is_anonymous')->default(false);
            $table->unsignedInteger('helpful_count')->default(0);
            $table->unsignedInteger('not_helpful_count')->default(0);
            $table->boolean('is_best_answer')->default(false); // Marked by question author
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            // Only one best answer per question
            $table->unique(['question_id'], 'unique_best_answer')->where('is_best_answer', true);
            
            // Indexes
            $table->index(['question_id', 'is_best_answer', 'helpful_count']);
            $table->index(['user_id', 'user_type']);
            $table->index(['is_verified', 'helpful_count']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_answers');
    }
};
