<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id('promotion_id');
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->tinyInteger('type')->comment('1: Percentage, 2: Fixed Amount');
            $table->decimal('value', 18, 2);
            $table->decimal('min_order_amount', 18, 2)->nullable();
            $table->decimal('max_discount_amount', 18, 2)->nullable();
            $table->timestamp('start_date')->useCurrent();
            $table->timestamp('end_date')->useCurrent();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('promotion_codes', function (Blueprint $table) {
            $table->id('promotion_code_id');
            $table->foreignId('promotion_id')->constrained('promotions', 'promotion_id')->onDelete('cascade');
            $table->string('code', 50)->unique();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('order_promotion', function (Blueprint $table) {
            $table->primary(['order_id', 'promotion_id']);
            $table->foreignId('order_id')->constrained('orders', 'order_id')->onDelete('cascade');
            $table->foreignId('promotion_id')->constrained('promotions', 'promotion_id')->onDelete('cascade');
            $table->decimal('discount_applied', 18, 2);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_promotion');
        Schema::dropIfExists('promotion_codes');
        Schema::dropIfExists('promotions');
    }
};