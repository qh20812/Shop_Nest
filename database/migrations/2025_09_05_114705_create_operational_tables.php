<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipping_details', function (Blueprint $table) {
            $table->id('shipping_detail_id');
            $table->foreignId('order_id')->unique()->constrained('orders', 'order_id')->onDelete('cascade');
            $table->string('shipping_provider', 100);
            $table->string('tracking_number', 100)->nullable()->index();
            $table->string('external_order_id', 100)->nullable();
            $table->tinyInteger('status');
            $table->decimal('shipping_fee', 18, 2);
            $table->text('status_history')->nullable()->comment('JSON history from provider');
            $table->timestamps();
        });

        Schema::create('returns', function (Blueprint $table) {
            $table->id('return_id');
            $table->foreignId('order_id')->constrained('orders', 'order_id');
            $table->foreignId('customer_id')->constrained('users');
            $table->string('return_number', 50)->unique();
            $table->tinyInteger('reason');
            $table->text('description');
            $table->tinyInteger('status')->comment('1: Requested, 2: Approved, 3: Rejected, 4: Processing, 5: Completed');
            $table->decimal('refund_amount', 18, 2);
            $table->tinyInteger('type')->comment('1: Refund, 2: Exchange');
            $table->text('admin_notes')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();
        });

        Schema::create('return_items', function (Blueprint $table) {
            $table->id('return_item_id');
            $table->foreignId('return_id')->constrained('returns', 'return_id')->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('product_variants', 'variant_id');
            $table->integer('quantity');
            $table->decimal('unit_price', 18, 2);
            $table->decimal('total_price', 18, 2);
            $table->string('reason', 500)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('return_items');
        Schema::dropIfExists('returns');
        Schema::dropIfExists('shipping_details');
    }
};