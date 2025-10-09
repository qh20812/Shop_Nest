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
        Schema::table('promotions', function (Blueprint $table) {
            // Enhanced promotion features
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium')->after('is_active');
            $table->boolean('stackable')->default(false)->after('priority'); // Can combine with other promotions
            $table->json('customer_eligibility')->nullable()->after('stackable'); // Customer segments, groups
            $table->json('geographic_restrictions')->nullable()->after('customer_eligibility'); // Countries, regions
            $table->json('product_restrictions')->nullable()->after('geographic_restrictions'); // Categories, brands, specific products
            $table->decimal('budget_limit', 12, 2)->nullable()->after('product_restrictions'); // Total budget for promotion
            $table->decimal('budget_used', 12, 2)->default(0)->after('budget_limit'); // Amount used so far
            $table->unsignedInteger('daily_usage_limit')->nullable()->after('budget_used');
            $table->unsignedInteger('daily_usage_count')->default(0)->after('daily_usage_limit');
            $table->unsignedInteger('per_customer_limit')->nullable()->after('daily_usage_count'); // Max uses per customer
            $table->boolean('first_time_customer_only')->default(false)->after('per_customer_limit');
            $table->decimal('minimum_cart_value', 10, 2)->nullable()->after('first_time_customer_only');
            $table->decimal('maximum_discount_amount', 10, 2)->nullable()->after('minimum_cart_value');
            $table->json('time_restrictions')->nullable()->after('maximum_discount_amount'); // Days of week, hours
            $table->string('auto_apply_condition', 500)->nullable()->after('time_restrictions'); // Auto-apply rules
            $table->text('terms_and_conditions')->nullable()->after('auto_apply_condition');
            $table->timestamp('last_used_at')->nullable()->after('terms_and_conditions');
            
            // Add indexes for enhanced querying
            $table->index(['priority', 'is_active', 'end_date']);
            $table->index(['stackable', 'is_active']);
            $table->index(['first_time_customer_only', 'is_active']);
            $table->index(['budget_limit', 'budget_used']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promotions', function (Blueprint $table) {
            // Drop indexes first
            $table->dropIndex(['priority', 'is_active', 'end_date']);
            $table->dropIndex(['stackable', 'is_active']);
            $table->dropIndex(['first_time_customer_only', 'is_active']);
            $table->dropIndex(['budget_limit', 'budget_used']);
            
            // Drop columns
            $table->dropColumn([
                'priority',
                'stackable',
                'customer_eligibility',
                'geographic_restrictions',
                'product_restrictions',
                'budget_limit',
                'budget_used',
                'daily_usage_limit',
                'daily_usage_count',
                'per_customer_limit',
                'first_time_customer_only',
                'minimum_cart_value',
                'maximum_discount_amount',
                'time_restrictions',
                'auto_apply_condition',
                'terms_and_conditions',
                'last_used_at'
            ]);
        });
    }
};
