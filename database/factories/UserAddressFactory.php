<?php

namespace Database\Factories;

use App\Enums\AdministrativeDivisionLevel;
use App\Models\AdministrativeDivision;
use App\Models\Country;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserAddress>
 */
class UserAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $streetAddress = ['124 Cách Mạng Tháng 8', '221 Nguyễn Văn Cừ', '10 Trần Hưng Đạo', '50 Lý Thường Kiệt', '75 Hai Bà Trưng', '200 Phan Đình Phùng', '300 Lê Lợi', '150 Nguyễn Trãi', '400 Trần Phú', '500 Điện Biên Phủ'];

        $province = AdministrativeDivision::where('level', AdministrativeDivisionLevel::PROVINCE)
            ->inRandomOrder()
            ->first();

        $wardId = $province
            ? AdministrativeDivision::where('parent_id', $province->id)->inRandomOrder()->value('id')
            : null;

        $familyNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];
        $givenNames = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Hải', 'Hoa', 'Hùng', 'Huy', 'Lan', 'Linh', 'Mai', 'Minh', 'Nam', 'Ngọc', 'Phương', 'Quân', 'Thảo', 'Trang', 'Tuấn'];

        return [
            'user_id' => User::factory(),
            'full_name' => fake()->randomElement($familyNames).' '.fake()->randomElement($givenNames),
            'phone_number' => fake()->numerify('09########'),
            'street_address' => fake()->randomElement($streetAddress),
            'country_id' => $province?->country_id ?? Country::where('iso_code_2', 'VN')->value('id'),
            'province_id' => $province?->id,
            'district_id' => null,
            'ward_id' => $wardId,
            'latitude' => fake()->latitude(10.5, 11.0),
            'longitude' => fake()->longitude(106.5, 107.0),
            'is_default' => random_int(0, 1),
        ];
    }
}
