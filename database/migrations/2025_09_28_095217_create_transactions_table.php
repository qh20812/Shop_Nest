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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('order_id')->constrained('orders', 'order_id'); // Foreign key linking to orders table
            $table->enum('type', ['payment', 'refund']); // Type of transaction
            $table->decimal('amount', 18, 2); // Monetary value of the transaction
            $table->string('currency', 3); // ISO 4217 currency code (e.g., 'USD', 'VND')
            $table->string('gateway'); // Payment method or gateway (e.g., 'COD', 'Stripe', 'PayPal')
            $table->string('gateway_transaction_id')->nullable(); // External payment gateway transaction ID
            $table->string('status')->default('completed'); // Transaction status (e.g., 'pending', 'completed', 'failed')
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
