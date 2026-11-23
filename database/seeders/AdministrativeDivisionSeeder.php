<?php

namespace Database\Seeders;

use App\Enums\AdministrativeDivisionLevel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class AdministrativeDivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('public/data/provinces.json');

        if (! File::exists($jsonPath)) {
            $this->command?->error("File provinces.json không tồn tại tại {$jsonPath}");

            return;
        }

        $rawJson = File::get($jsonPath);
        $provinces = json_decode($rawJson, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($provinces)) {
            $this->command?->error('File provinces.json không phải JSON hợp lệ: '.json_last_error_msg());

            return;
        }

        // Insert or update Vietnam country
        $country = DB::table('countries')->where('iso_code_2', 'VN')->first();

        if (! $country) {
            DB::table('countries')->insert([
                'iso_code_2' => 'VN',
                'name' => json_encode(['vi' => 'Việt Nam', 'en' => 'Vietnam']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $countryId = DB::table('countries')->where('iso_code_2', 'VN')->value('id');
        $now = now();
        $provinceLevel = AdministrativeDivisionLevel::PROVINCE->value;
        $wardLevel = AdministrativeDivisionLevel::WARD->value;

        $provinceRows = [];

        foreach ($provinces as $province) {
            if (! isset($province['code'], $province['name'])) {
                continue;
            }

            $provinceRows[] = [
                'country_id' => $countryId,
                'parent_id' => null,
                'name' => json_encode(['vi' => $province['name']]),
                'level' => $provinceLevel,
                'code' => (string) $province['code'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('administrative_divisions')->upsert(
            $provinceRows,
            ['code', 'level'],
            ['country_id', 'parent_id', 'name', 'updated_at']
        );

        $provinceIds = DB::table('administrative_divisions')
            ->where('level', $provinceLevel)
            ->pluck('id', 'code')
            ->all();

        $wardRows = [];

        foreach ($provinces as $province) {
            if (! isset($province['code'])) {
                continue;
            }

            $parentId = $provinceIds[(string) $province['code']] ?? null;

            if (! $parentId) {
                continue;
            }

            foreach ($province['wards'] ?? [] as $ward) {
                $wardName = $ward['name'] ?? null;

                if ($wardName === null) {
                    continue;
                }

                $wardRows[] = [
                    'country_id' => $countryId,
                    'parent_id' => $parentId,
                    'name' => json_encode(['vi' => $wardName]),
                    'level' => $wardLevel,
                    'code' => (string) ($ward['code'] ?? $wardName),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        foreach (array_chunk($wardRows, 500) as $chunk) {
            DB::table('administrative_divisions')->upsert(
                $chunk,
                ['code', 'level'],
                ['country_id', 'parent_id', 'name', 'updated_at']
            );
        }

        $this->command?->info('Hoàn tất seeding bảng administrative_divisions từ provinces.json');
    }
}
