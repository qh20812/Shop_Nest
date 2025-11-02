<?php

namespace Database\Factories;

use App\Enums\AdministrativeDivisionLevel;
use App\Models\AdministrativeDivision;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AdministrativeDivision>
 */
class AdministrativeDivisionFactory extends Factory
{
    protected $model = AdministrativeDivision::class;

    public function definition(): array
    {
        $level = $this->faker->randomElement([
            AdministrativeDivisionLevel::PROVINCE,
            AdministrativeDivisionLevel::DISTRICT,
            AdministrativeDivisionLevel::WARD,
        ]);

        return [
            'country_id' => 1,
            'parent_id' => null,
            'name' => [
                'vi' => $this->faker->city(),
                'en' => $this->faker->city(),
            ],
            'level' => $level,
            'code' => (string) $this->faker->unique()->numerify('####'),
        ];
    }

    public function province(): self
    {
        return $this->state(function () {
            return [
                'level' => AdministrativeDivisionLevel::PROVINCE,
                'parent_id' => null,
            ];
        });
    }

    public function district(int $parentId): self
    {
        return $this->state(function () use ($parentId) {
            return [
                'level' => AdministrativeDivisionLevel::DISTRICT,
                'parent_id' => $parentId,
            ];
        });
    }

    public function ward(int $parentId): self
    {
        return $this->state(function () use ($parentId) {
            return [
                'level' => AdministrativeDivisionLevel::WARD,
                'parent_id' => $parentId,
            ];
        });
    }
}
