<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\ShipperProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ShipperSeeder extends Seeder
{
    public function run(): void
    {
        $shipperRole = Role::where('name->en', 'Shipper')->first();

        if (! $shipperRole) {
            $this->command->warn('Shipper role not found. Please run RoleSeeder first.');

            return;
        }

        $fixed = User::where('email', 'tai.bui@shopnest.vn')->first();

        if ($fixed && ! ShipperProfile::where('user_id', $fixed->id)->exists()) {
            ShipperProfile::factory()->create([
                'user_id' => $fixed->id,
                'status' => 'approved',
            ]);
        }

        $shippers = [
            ['first_name' => 'Văn Bình', 'last_name' => 'Nguyễn', 'email' => 'binh.nguyen@shopnest.vn', 'status' => 'pending'],
            ['first_name' => 'Quốc Cường', 'last_name' => 'Trần', 'email' => 'cuong.tran@shopnest.vn', 'status' => 'approved'],
            ['first_name' => 'Minh Đức', 'last_name' => 'Lê', 'email' => 'duc.le@shopnest.vn', 'status' => 'pending'],
            ['first_name' => 'Văn Hòa', 'last_name' => 'Phạm', 'email' => 'hoa.pham@shopnest.vn', 'status' => 'approved'],
            ['first_name' => 'Trung Kiên', 'last_name' => 'Hoàng', 'email' => 'kien.hoang@shopnest.vn', 'status' => 'pending'],
            ['first_name' => 'Đình Long', 'last_name' => 'Vũ', 'email' => 'long.vu@shopnest.vn', 'status' => 'approved'],
            ['first_name' => 'Văn Phong', 'last_name' => 'Đặng', 'email' => 'phong.dang@shopnest.vn', 'status' => 'rejected'],
            ['first_name' => 'Thị Mai', 'last_name' => 'Bùi', 'email' => 'mai.bui@shopnest.vn', 'status' => 'suspended'],
            ['first_name' => 'Quốc Việt', 'last_name' => 'Ngô', 'email' => 'viet.ngo@shopnest.vn', 'status' => 'pending'],
        ];

        foreach ($shippers as $index => $data) {
            $username = Str::slug($data['first_name'].' '.$data['last_name'], '.');

            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'username' => $username,
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'phone_number' => '08'.str_pad((string) (20000000 + $index), 8, '0', STR_PAD_LEFT),
                    'password' => Hash::make('@12345Password'),
                    'email_verified_at' => now(),
                    'is_active' => $data['status'] !== 'suspended',
                ]
            );

            if (! $user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }

            $user->roles()->syncWithoutDetaching([$shipperRole->id]);

            if (! ShipperProfile::where('user_id', $user->id)->exists()) {
                ShipperProfile::factory()->create([
                    'user_id' => $user->id,
                    'status' => $data['status'],
                ]);
            }
        }

        $this->command->info('Created shipper profiles.');
    }
}
