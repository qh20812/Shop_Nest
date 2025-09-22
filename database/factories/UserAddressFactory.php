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
        $streetAddress = ['124 Cách Mạng Tháng 8','221 Nguyễn Văn Cừ','10 Trần Hưng Đạo','50 Lý Thường Kiệt','75 Hai Bà Trưng','200 Phan Đình Phùng','300 Lê Lợi','150 Nguyễn Trãi','400 Trần Phú','500 Điện Biên Phủ'];
        $ward = ['Phường Sài Gòn','Phường Bình Thới','Phường Hòa Bình','Phường Phú Thọ','Phường Bình Hưng Hòa','Phường Tân Tạo','Phường An Lạc'];
        $district = ['Quận 1','Quận 2','Quận 3','Quận 4','Quận 5','Quận 6','Quận 7'];
        $city = ['Thành phố Hồ Chí Minh','Hà Nội','Đà Nẵng','Cần Thơ','Nha Trang'];

        return [
            'user_id' => User::factory(),
            'full_name' => fake()->name(),
            'phone_number' => fake()->numerify('+84-#########'),
            'street' => fake()->randomElement($streetAddress),
            'ward' => fake()->randomElement($ward),
            'district' => fake()->randomElement($district),
            'city' => fake()->randomElement($city),
            'is_default' => random_int(0, 1),
        ];
    }
}
