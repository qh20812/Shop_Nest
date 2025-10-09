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
        Schema::create('international_addresses', function (Blueprint $table) {
            $table->id();
            $table->morphs('addressable'); // For polymorphic relationship (User, Order, etc.)
            $table->enum('type', ['billing', 'shipping', 'pickup', 'default'])->default('shipping');
            
            // Personal information
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('company', 150)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 150)->nullable();
            
            // Address components (International standard)
            $table->string('address_line_1', 200); // Street number, street name
            $table->string('address_line_2', 200)->nullable(); // Apartment, suite, etc.
            $table->string('address_line_3', 200)->nullable(); // Additional address info
            $table->string('locality', 100); // City/Town
            $table->string('administrative_area', 100)->nullable(); // State/Province
            $table->string('sub_administrative_area', 100)->nullable(); // County/District
            $table->string('postal_code', 20)->nullable();
            $table->char('country_code', 2); // ISO 3166-1 alpha-2
            $table->string('country_name', 100);
            
            // Geocoding
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            
            // Validation and formatting
            $table->json('validation_result')->nullable(); // Address validation response
            $table->string('formatted_address', 500)->nullable(); // Google formatted address
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_default')->default(false);
            
            // Metadata
            $table->string('timezone', 50)->nullable();
            $table->json('metadata')->nullable(); // Additional country-specific fields
            
            $table->timestamps();
            
            // Note: morphs() method automatically creates index for addressable_type and addressable_id
            $table->index(['country_code', 'administrative_area']);
            $table->index(['postal_code', 'country_code']);
            $table->index(['is_default', 'type']);
            $table->index(['latitude', 'longitude']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('international_addresses');
    }
};
