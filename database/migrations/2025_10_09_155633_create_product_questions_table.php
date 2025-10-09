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
        Schema::create('product_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products', 'product_id')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('question');
            $table->enum('status', ['pending', 'answered', 'rejected'])->default('pending');
            $table->boolean('is_anonymous')->default(false);
            $table->unsignedInteger('helpful_count')->default(0);
            $table->unsignedInteger('answers_count')->default(0);
            $table->boolean('is_featured')->default(false); // Highlighted by seller
            $table->json('metadata')->nullable(); // Additional data
            $table->timestamps();
            
            // Indexes
            $table->index(['product_id', 'status', 'created_at']);
            $table->index(['user_id', 'status']);
            $table->index(['is_featured', 'helpful_count']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_questions');
    }
};
