<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->bigIncrements('wallet_id');
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->decimal('balance', 18, 2)->default(0);
            $table->decimal('total_earned', 18, 2)->default(0);
            $table->decimal('total_spent', 18, 2)->default(0);
            $table->string('currency', 3)->default('VND');
            $table->enum('status', ['active', 'suspended', 'closed'])->default('active');
            $table->timestamps();

            $table->index('status');
        });

        Schema::create('wallet_transactions', function (Blueprint $table) {
            $table->bigIncrements('transaction_id');
            $table->foreignId('wallet_id')->constrained('wallets', 'wallet_id')->cascadeOnDelete();
            $table->string('type', 50);
            $table->string('direction', 10);
            $table->decimal('amount', 18, 2);
            $table->decimal('balance_before', 18, 2)->nullable();
            $table->decimal('balance_after', 18, 2)->nullable();
            $table->string('reference_type', 50)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['wallet_id', 'created_at']);
            $table->index(['reference_type', 'reference_id']);
            $table->index(['type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('wallets');
    }
};
