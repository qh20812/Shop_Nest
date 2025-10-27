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
        Schema::create('promotion_templates', function (Blueprint $table) {
            $table->bigIncrements('template_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->tinyInteger('type');
            $table->decimal('value', 18, 2);
            $table->json('config');
            $table->enum('category', ['seasonal', 'category_specific', 'customer_specific', 'custom']);
            $table->boolean('is_public')->default(false);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_templates');
    }
};
