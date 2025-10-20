<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seller_promotion_wallets', function (Blueprint $table) {
            $table->bigIncrements('wallet_id');
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('balance', 18, 2)->default(0.00);
            $table->decimal('total_earned', 18, 2)->default(0.00);
            $table->decimal('total_spent', 18, 2)->default(0.00);
            $table->string('currency', 3)->default('VND');
            $table->enum('status', ['active', 'suspended', 'closed'])->default('active');
            $table->timestamps();

            $table->unique('seller_id');
            $table->index(['status']);
        });

        Schema::create('seller_wallet_transactions', function (Blueprint $table) {
            $table->bigIncrements('transaction_id');
            $table->foreignId('wallet_id')->constrained('seller_promotion_wallets', 'wallet_id')->cascadeOnDelete();
            $table->decimal('amount', 18, 2);
            $table->enum('type', ['credit', 'debit']);
            $table->text('description')->nullable();
            $table->string('reference_type', 50)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->decimal('balance_before', 18, 2)->nullable();
            $table->decimal('balance_after', 18, 2)->nullable();
            $table->timestamps();

            $table->index(['wallet_id', 'created_at']);
            $table->index(['reference_type', 'reference_id']);
        });

        Schema::create('seller_promotion_participation', function (Blueprint $table) {
            $table->bigIncrements('participation_id');
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('platform_promotion_id')->constrained('promotions', 'promotion_id')->cascadeOnDelete();
            $table->enum('status', ['pending', 'approved', 'rejected', 'active', 'completed'])->default('pending');
            $table->decimal('seller_contribution', 18, 2)->default(0.00);
            $table->timestamps();

            $table->unique(['seller_id', 'platform_promotion_id'], 'seller_participation_unique');
            $table->index(['status']);
        });

        Schema::table('promotions', function (Blueprint $table) {
            $table->enum('created_by_type', ['admin', 'seller'])->default('admin')->after('auto_apply_new_products');
            $table->foreignId('seller_id')->nullable()->after('created_by_type')->constrained('users')->nullOnDelete();
            $table->enum('budget_source', ['platform', 'seller_wallet'])->default('platform')->after('seller_id');
            $table->decimal('allocated_budget', 18, 2)->nullable()->after('budget_source');
            $table->decimal('spent_budget', 18, 2)->default(0.00)->after('allocated_budget');
            $table->decimal('roi_percentage', 5, 2)->nullable()->after('spent_budget');

            $table->index(['created_by_type']);
        });
    }

    public function down(): void
    {
        Schema::table('promotions', function (Blueprint $table) {
            $table->dropForeign(['seller_id']);
            $table->dropIndex(['created_by_type']);
            $table->dropColumn([
                'created_by_type',
                'seller_id',
                'budget_source',
                'allocated_budget',
                'spent_budget',
                'roi_percentage',
            ]);
        });

        Schema::dropIfExists('seller_promotion_participation');
        Schema::dropIfExists('seller_wallet_transactions');
        Schema::dropIfExists('seller_promotion_wallets');
    }
};
