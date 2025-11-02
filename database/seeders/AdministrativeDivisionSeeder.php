<?php

namespace Database\Seeders;

use App\Enums\AdministrativeDivisionLevel;
use App\Models\AdministrativeDivision;
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
        $country = DB::table('countries')->updateOrInsert(
            ['iso_code_2' => 'VN'],
            [
                'name' => json_encode(['vi' => 'Việt Nam', 'en' => 'Vietnam']),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $countryId = DB::table('countries')->where('iso_code_2', 'VN')->value('id');

        DB::transaction(function () use ($provinces, $countryId) {
            foreach ($provinces as $province) {
                if (! isset($province['code'], $province['name'])) {
                    continue;
                }

                $provinceCode = (string) $province['code'];

                $provinceModel = AdministrativeDivision::updateOrCreate(
                    ['code' => $provinceCode, 'level' => AdministrativeDivisionLevel::PROVINCE],
                    [
                        'country_id' => $countryId,
                        'parent_id' => null,
                        'name' => ['vi' => $province['name']],
                        'level' => AdministrativeDivisionLevel::PROVINCE,
                        'code' => $provinceCode,
                    ]
                );

                $this->command?->info("Đã seed tỉnh/thành: {$province['name']} ({$provinceCode})");

                // Seed wards as districts (since JSON doesn't have district level)
                foreach ($province['wards'] ?? [] as $ward) {
                    $wardName = $ward['name'] ?? null;

                    if ($wardName === null) {
                        continue;
                    }

                    $wardCode = (string) ($ward['code'] ?? $wardName);

                    AdministrativeDivision::updateOrCreate(
                        ['code' => $wardCode, 'level' => AdministrativeDivisionLevel::DISTRICT],
                        [
                            'country_id' => $countryId,
                            'parent_id' => $provinceModel->id,
                            'name' => ['vi' => $wardName],
                            'level' => AdministrativeDivisionLevel::DISTRICT,
                            'code' => $wardCode,
                        ]
                    );
                }
            }
        });

        $this->command?->info('Hoàn tất seeding bảng administrative_divisions từ provinces.json');
    }
}
