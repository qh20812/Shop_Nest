<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    private const PASSWORD = '@12345Password';

    public function run(): void
    {
        $adminRole = Role::where('name->en', 'Admin')->first();
        $sellerRole = Role::where('name->en', 'Seller')->first();
        $customerRole = Role::where('name->en', 'Customer')->first();
        $shipperRole = Role::where('name->en', 'Shipper')->first();

        $this->createFixedUser([
            'username' => 'quan.nguyen',
            'email' => 'quan.nguyen@shopnest.vn',
            'first_name' => 'Minh Quân',
            'last_name' => 'Nguyễn',
        ], $adminRole);

        $this->createFixedUser([
            'username' => 'hung.nguyen',
            'email' => 'hung.nguyen@shopnest.vn',
            'first_name' => 'Văn Hùng',
            'last_name' => 'Nguyễn',
            'shop_status' => 'active',
            'approved_at' => now(),
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'nam.tran',
            'email' => 'nam.tran@shopnest.vn',
            'first_name' => 'Hoàng Nam',
            'last_name' => 'Trần',
            'shop_status' => 'active',
            'approved_at' => now(),
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'ha.le',
            'email' => 'ha.le@shopnest.vn',
            'first_name' => 'Thu Hà',
            'last_name' => 'Lê',
            'shop_status' => 'active',
            'approved_at' => now(),
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'anh.pham',
            'email' => 'anh.pham@shopnest.vn',
            'first_name' => 'Mai Anh',
            'last_name' => 'Phạm',
            'shop_status' => 'active',
            'approved_at' => now(),
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'huy.vo',
            'email' => 'huy.vo@shopnest.vn',
            'first_name' => 'Đức Huy',
            'last_name' => 'Võ',
            'shop_status' => 'active',
            'approved_at' => now(),
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'linh.dang',
            'email' => 'linh.dang@shopnest.vn',
            'first_name' => 'Ngọc Linh',
            'last_name' => 'Đặng',
            'shop_status' => 'active',
            'approved_at' => now(),
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'huy.do',
            'email' => 'huy.do@shopnest.vn',
            'first_name' => 'Quang Huy',
            'last_name' => 'Đỗ',
            'shop_status' => 'active',
            'approved_at' => now(),
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'trang.nguyen',
            'email' => 'trang.nguyen@shopnest.vn',
            'first_name' => 'Thu Trang',
            'last_name' => 'Nguyễn',
            'shop_status' => 'active',
            'approved_at' => now(),
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'tuan.hoang',
            'email' => 'tuan.hoang@shopnest.vn',
            'first_name' => 'Anh Tuấn',
            'last_name' => 'Hoàng',
            'shop_status' => 'pending',
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'vy.nguyen',
            'email' => 'vy.nguyen@shopnest.vn',
            'first_name' => 'Thảo Vy',
            'last_name' => 'Nguyễn',
            'shop_status' => 'pending',
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'khoa.tran',
            'email' => 'khoa.tran@shopnest.vn',
            'first_name' => 'Minh Khoa',
            'last_name' => 'Trần',
            'shop_status' => 'pending',
        ], $sellerRole);

        $this->createFixedUser([
            'username' => 'tai.bui',
            'email' => 'tai.bui@shopnest.vn',
            'first_name' => 'Văn Tài',
            'last_name' => 'Bùi',
        ], $shipperRole);

        $this->createFixedUser([
            'username' => 'lan.nguyen',
            'email' => 'lan.nguyen@gmail.com',
            'first_name' => 'Thị Lan',
            'last_name' => 'Nguyễn',
        ], $customerRole);

        $this->createVietnameseCustomers($customerRole, 100);
    }

    private function createFixedUser(array $attributes, ?Role $role): User
    {
        $user = User::firstOrCreate(
            ['email' => $attributes['email']],
            [
                ...$attributes,
                'phone_number' => $attributes['phone_number'] ?? '07'.str_pad((string) (abs(crc32($attributes['email'])) % 100000000), 8, '0', STR_PAD_LEFT),
                'password' => Hash::make(self::PASSWORD),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        if ($role) {
            $user->roles()->syncWithoutDetaching([$role->id]);
        }

        return $user;
    }

    private function createVietnameseCustomers(?Role $customerRole, int $target): void
    {
        if (! $customerRole) {
            return;
        }

        $current = User::whereHas('roles', fn ($query) => $query->where('name->en', 'Customer'))->count();
        $missing = max(0, $target - $current);

        if ($missing === 0) {
            return;
        }

        $familyNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
        $givenNames = ['An', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hà', 'Hải', 'Hiếu', 'Hoa', 'Hùng', 'Huy', 'Khanh', 'Lan', 'Linh', 'Long', 'Mai', 'Minh', 'Nam', 'Nga', 'Ngọc', 'Nhung', 'Phúc', 'Phương', 'Quân', 'Quỳnh', 'Sơn', 'Tâm', 'Thảo', 'Trang', 'Trung', 'Tuấn', 'Tú', 'Vân', 'Vy', 'Yến'];

        for ($i = 0; $i < $missing; $i++) {
            $family = $familyNames[$i % count($familyNames)];
            $given = $givenNames[($i * 7) % count($givenNames)];
            $slug = Str::slug($given.' '.$family, '.');
            $email = $slug.'@gmail.com';
            $suffix = 1;

            while (User::where('email', $email)->orWhere('username', $slug)->exists()) {
                $suffix++;
                $email = $slug.$suffix.'@gmail.com';
                $slug = Str::slug($given.' '.$family, '.').$suffix;
            }

            $user = User::factory()->create([
                'username' => $slug,
                'email' => $email,
                'first_name' => $given,
                'last_name' => $family,
                'phone_number' => '09'.str_pad((string) (10000000 + $i), 8, '0', STR_PAD_LEFT),
                'password' => Hash::make(self::PASSWORD),
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            $user->roles()->syncWithoutDetaching([$customerRole->id]);
        }
    }
}
