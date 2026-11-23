<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        Country::updateOrCreate(
            ['iso_code_2' => 'VN'],
            [
                'name' => ['vi' => 'Việt Nam', 'en' => 'Vietnam'],
                'division_structure' => [
                    'levels' => ['province', 'ward'],
                    'labels' => ['vi' => ['Tỉnh/Thành phố', 'Phường/Xã'], 'en' => ['Province', 'Ward']],
                ],
            ]
        );

        Country::updateOrCreate(
            ['iso_code_2' => 'US'],
            [
                'name' => ['vi' => 'Hoa Kỳ', 'en' => 'United States'],
                'division_structure' => [
                    'levels' => ['state', 'county', 'city'],
                    'labels' => ['en' => ['State', 'County', 'City']],
                ],
            ]
        );
    }
}
