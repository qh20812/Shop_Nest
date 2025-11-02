<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Country::updateOrCreate(
            ['iso_code_2' => 'VN'],
            [
                'name' => ['vi' => 'Việt Nam', 'en' => 'Vietnam'],
                'division_structure' => [
                    'levels' => ['province', 'commune'],
                    'labels' => ['vi' => ['Tỉnh', 'Xã/Phường'], 'en' => ['Province', 'Commune']],
                ],
            ]
        );

        \App\Models\Country::updateOrCreate(
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
