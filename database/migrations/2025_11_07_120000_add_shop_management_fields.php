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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('shop_status', ['pending', 'active', 'suspended', 'rejected'])->default('pending')->after('is_active');
            $table->timestamp('approved_at')->nullable()->after('shop_status');
            $table->timestamp('suspended_until')->nullable()->after('approved_at');
            $table->json('shop_settings')->nullable()->after('suspended_until');
            $table->text('rejection_reason')->nullable()->after('shop_settings');
            $table->text('suspension_reason')->nullable()->after('rejection_reason');
            $table->string('shop_logo')->nullable()->after('suspension_reason');
            $table->text('shop_description')->nullable()->after('shop_logo');
        });

        Schema::create('shop_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users');
            $table->foreignId('shop_id')->constrained('users');
            $table->string('action');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('shop_violations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('users');
            $table->foreignId('reported_by')->constrained('users');
            $table->string('violation_type');
            $table->string('severity');
            $table->text('description');
            $table->string('status')->default('open');
            $table->timestamp('resolved_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    Schema::dropIfExists('shop_violations');
    Schema::dropIfExists('shop_audit_logs');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'shop_status',
                'approved_at',
                'suspended_until',
                'shop_settings',
                'rejection_reason',
                'suspension_reason',
                'shop_logo',
                'shop_description',
            ]);
        });
    }
};
