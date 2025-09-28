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
        // 1.1. Create shipper_profiles table
        Schema::create('shipper_profiles', function (Blueprint $table) {
            $table->foreignId('user_id')->primary()->constrained('users'); // One-to-one relationship with users
            $table->string('id_card_number'); // National ID card number
            $table->string('id_card_front_url'); // URL for ID card front image
            $table->string('id_card_back_url'); // URL for ID card back image
            $table->string('driver_license_number'); // Driver's license number
            $table->string('driver_license_front_url'); // URL for driver's license image
            $table->string('vehicle_type'); // e.g., 'Motorbike'
            $table->string('license_plate'); // Vehicle's license plate number
            $table->enum('status', ['pending', 'approved', 'rejected', 'suspended'])->default('pending'); // Shipper approval workflow
            $table->timestamps();
        });

        // 1.2. Create hubs table
        Schema::create('hubs', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Hub name (e.g., "Tan Binh Hub - HCMC")
            $table->text('address'); // Full address of the hub
            $table->foreignId('ward_id')->nullable()->constrained('administrative_divisions'); // Link to standardized address system
            $table->decimal('latitude', 10, 8)->nullable(); // GPS coordinates
            $table->decimal('longitude', 11, 8)->nullable();
            $table->timestamps();
        });

        // 1.3. Create shipment_journeys table
        Schema::create('shipment_journeys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders', 'order_id'); // Link to orders table (using order_id as PK)
            $table->enum('leg_type', ['first_mile', 'middle_mile', 'last_mile']); // Type of delivery leg
            $table->foreignId('shipper_id')->nullable()->constrained('users'); // Shipper for first and last mile
            $table->foreignId('start_hub_id')->nullable()->constrained('hubs'); // Starting hub
            $table->foreignId('end_hub_id')->nullable()->constrained('hubs'); // Ending hub
            $table->string('status'); // Status of this leg (e.g., 'assigned', 'picked_up', 'in_transit', 'completed')
            $table->timestamps();
        });

        // 1.4. Modify the orders table
        Schema::table('orders', function (Blueprint $table) {
            // Add shipper_id column after customer_id
            $table->foreignId('shipper_id')->nullable()->constrained('users')->after('customer_id');
            
            // Drop the old integer status column
            $table->dropColumn('status');
            
            // Add new detailed string status column
            $table->string('status')->default('pending_confirmation')->after('total_amount')
                ->comment('Statuses: pending_confirmation, processing, pending_assignment, assigned_to_shipper, delivering, delivered, completed, cancelled, returned');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert orders table changes first
        Schema::table('orders', function (Blueprint $table) {
            // Drop the new shipper_id foreign key and column
            $table->dropForeign(['shipper_id']);
            $table->dropColumn('shipper_id');
            
            // Drop the new string status column
            $table->dropColumn('status');
            
            // Re-add the old integer status column
            $table->tinyInteger('status')->after('total_amount')
                ->comment('e.g., 0:Pending, 1:Processing, 2:Shipped, 3:Delivered, 4:Cancelled');
        });

        // Drop tables in reverse order to respect foreign key constraints
        Schema::dropIfExists('shipment_journeys');
        Schema::dropIfExists('hubs');
        Schema::dropIfExists('shipper_profiles');
    }
};
