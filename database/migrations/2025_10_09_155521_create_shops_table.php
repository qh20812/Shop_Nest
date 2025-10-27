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
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->text('description')->nullable();
            $table->string('logo', 500)->nullable();
            $table->string('banner', 500)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('website', 300)->nullable();
            
            // Business information
            $table->string('business_type', 100)->nullable(); // Individual, LLC, Corporation, etc.
            $table->string('tax_id', 50)->nullable();
            $table->string('business_license', 100)->nullable();
            
            // Address (can also use polymorphic with international_addresses)
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 100)->nullable();
            
            // Shop settings
            $table->enum('status', ['pending', 'active', 'suspended', 'inactive'])->default('pending');
            $table->boolean('is_verified')->default(false);
            $table->decimal('commission_rate', 5, 2)->default(10.00); // Platform commission %
            $table->json('shipping_policies')->nullable();
            $table->json('return_policy')->nullable();
            $table->json('social_media')->nullable(); // Facebook, Instagram, etc.
            
            // Performance metrics
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->unsignedInteger('total_reviews')->default(0);
            $table->unsignedInteger('total_sales')->default(0);
            $table->decimal('total_revenue', 15, 2)->default(0.00);
            
            // SEO and marketing
            $table->string('meta_title', 200)->nullable();
            $table->text('meta_description')->nullable();
            $table->json('keywords')->nullable();
            
            // Timestamps
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['status', 'is_verified']);
            $table->index(['owner_id', 'status']);
            $table->index('rating');
            $table->index(['city', 'state', 'country']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
