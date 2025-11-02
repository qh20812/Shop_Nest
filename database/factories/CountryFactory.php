<?php

namespace Database\Factories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Country>
 */
class CountryFactory extends Factory
{
    protected $model = Country::class;

    public function definition(): array
    {
        return [
            'name' => [
                'vi' => $this->faker->country(),
                'en' => $this->faker->country(),
            ],
            'iso_code_2' => strtoupper($this->faker->lexify('??')),
            'division_structure' => [
                'levels' => ['province', 'district', 'ward'],
                'labels' => ['en' => ['Province', 'District', 'Ward']],
            ],
        ];
    }
}
