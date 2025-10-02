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
        // Bảng chứa các yêu cầu trả hàng
        Schema::create('returns', function (Blueprint $table) {
            $table->id('return_id');
            $table->foreignId('order_id')->constrained('orders', 'order_id')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->string('return_number')->unique();
            $table->unsignedTinyInteger('reason')->comment('Lý do trả hàng, ví dụ: 1: Sản phẩm lỗi, 2: Sai sản phẩm...');
            $table->text('description')->nullable();
            $table->unsignedTinyInteger('status')->default(1)->comment('1: Pending, 2: Approved, 3: Rejected, 4: Refunded, 5: Exchanged');
            $table->decimal('refund_amount', 15, 2)->nullable();
            $table->unsignedTinyInteger('type')->comment('1: Refund, 2: Exchange');
            $table->text('admin_note')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Bảng chứa các sản phẩm trong một yêu cầu trả hàng
        Schema::create('return_items', function (Blueprint $table) {
            $table->id('return_item_id');
            $table->foreignId('return_id')->constrained('returns', 'return_id')->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('product_variants', 'variant_id')->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('total_price', 15, 2);
            $table->string('reason')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_items');
        Schema::dropIfExists('returns');
    }
};
