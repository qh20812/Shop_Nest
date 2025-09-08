<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id('cart_item_id');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('product_variants', 'variant_id')->onDelete('cascade');
            $table->integer('quantity');
            $table->timestamps();
            
            $table->unique(['user_id', 'variant_id']);
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id('order_id');
            $table->foreignId('customer_id')->constrained('users');
            $table->string('order_number', 50)->unique();
            $table->decimal('sub_total', 18, 2);
            $table->decimal('shipping_fee', 18, 2)->default(0);
            $table->decimal('discount_amount', 18, 2)->default(0);
            $table->decimal('total_amount', 18, 2);
            $table->tinyInteger('status')->comment('e.g., 0:Pending, 1:Processing, 2:Shipped, 3:Delivered, 4:Cancelled');
            $table->tinyInteger('payment_method')->comment('e.g., 1:COD, 2:Bank Transfer, 3:Online Gateway');
            $table->tinyInteger('payment_status')->comment('e.g., 0:Unpaid, 1:Paid, 2:Failed');
            $table->string('payment_transaction_id', 500)->nullable();
            $table->foreignId('shipping_address_id')->nullable()->constrained('user_addresses')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id('order_item_id');
            $table->foreignId('order_id')->constrained('orders', 'order_id')->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('product_variants', 'variant_id')->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('unit_price', 18, 2);
            $table->decimal('total_price', 18, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('cart_items');
    }
};