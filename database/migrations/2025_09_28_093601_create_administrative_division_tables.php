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
        // Create countries table
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->json('name'); // Multilingual country names: {"en": "Vietnam", "vi": "Việt Nam"}
            $table->string('iso_code_2', 2)->unique(); // 2-character country code: 'VN', 'US'
            $table->timestamps();
        });

        // Create administrative_divisions table
        Schema::create('administrative_divisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_id')->constrained('countries');
            $table->foreignId('parent_id')->nullable()->constrained('administrative_divisions'); // Self-referencing for hierarchy
            $table->json('name'); // Multilingual division names: {"en": "Ho Chi Minh City", "vi": "Thành phố Hồ Chí Minh"}
            $table->integer('level'); // Administrative level: 1=province/state, 2=district, 3=ward
            $table->string('code')->nullable(); // Official code for the division
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop tables in reverse order to respect foreign key constraints
        Schema::dropIfExists('administrative_divisions');
        Schema::dropIfExists('countries');
    }
};
