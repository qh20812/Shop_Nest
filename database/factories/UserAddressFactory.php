<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAddress>
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

        return [
            'user_id' => User::factory(),
            'full_name' => fake()->name(),
            'phone_number' => fake()->numerify('+84-#########'),
            'street_address' => fake()->randomElement($streetAddress),
            'country_id' => null,
            'province_id' => null,
            'district_id' => null,
            'ward_id' => null,
            'latitude' => fake()->latitude(10.5, 11.0),
            'longitude' => fake()->longitude(106.5, 107.0),
            'is_default' => random_int(0, 1),
        ];
    }
}
