<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\ShipperProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShipperSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the Shipper role ID
        $shipperRole = Role::where('name->en', 'Shipper')->first();

        if (! $shipperRole) {
            $this->command->warn('Shipper role not found. Please run RoleSeeder first.');

            return;
        }

        if (ShipperProfile::count() >= 10) {
            $this->command->info('Shipper profiles already seeded, skipping.');

            return;
        }

        // Create 10 shipper users with different statuses
        $statusDistribution = [
            'pending' => 4,
            'approved' => 4,
            'rejected' => 1,
            'suspended' => 1,
        ];

        foreach ($statusDistribution as $status => $count) {
            for ($i = 0; $i < $count; $i++) {
                // Create user
                $user = User::factory()->create([
                    'username' => fake()->unique()->userName(),
                    'email' => fake()->unique()->safeEmail(),
                    'first_name' => fake()->firstName(),
                    'last_name' => fake()->lastName(),
                    'phone_number' => fake()->unique()->phoneNumber(),
                    'is_active' => $status !== 'suspended',
                ]);

                // Assign Shipper role
                $user->roles()->attach($shipperRole->id);

                // Create shipper profile with specific status
                ShipperProfile::factory()->create([
                    'user_id' => $user->id,
                    'status' => $status,
                ]);
            }
        }

        $this->command->info('Created 10 shipper users with profiles.');
    }
}
