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
        Schema::table('user_addresses', function (Blueprint $table) {
            // Drop old free-text address columns
            $table->dropColumn(['city', 'district', 'ward']);
            
            // Add new foreign key columns after user_id
            $table->foreignId('country_id')->nullable()->constrained('countries')->after('user_id');
            $table->foreignId('province_id')->nullable()->constrained('administrative_divisions')->after('country_id');
            $table->foreignId('district_id')->nullable()->constrained('administrative_divisions')->after('province_id');
            $table->foreignId('ward_id')->nullable()->constrained('administrative_divisions')->after('district_id');
            
            // Add geolocation columns
            $table->decimal('latitude', 10, 8)->nullable()->after('ward_id');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            
            // Rename street column to street_address for clarity
            $table->renameColumn('street', 'street_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_addresses', function (Blueprint $table) {
            // Drop new foreign key constraints and columns
            $table->dropForeign(['country_id']);
            $table->dropForeign(['province_id']);
            $table->dropForeign(['district_id']);
            $table->dropForeign(['ward_id']);
            $table->dropColumn(['country_id', 'province_id', 'district_id', 'ward_id']);
            
            // Drop geolocation columns
            $table->dropColumn(['latitude', 'longitude']);
            
            // Rename street_address back to street
            $table->renameColumn('street_address', 'street');
            
            // Re-add old string columns
            $table->string('city')->after('street'); // Tỉnh/Thành phố
            $table->string('district')->after('city'); // Quận/Huyện
            $table->string('ward')->after('district'); // Phường/Xã
        });
    }
};
