<?php

namespace Tests\Feature\User;

use App\Enums\AdministrativeDivisionLevel;
use App\Models\AdministrativeDivision;
use App\Models\Country;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddressControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Country::factory()->create([
            'id' => 1,
            'iso_code_2' => 'VN',
            'name' => ['vi' => 'Việt Nam', 'en' => 'Vietnam'],
        ]);
    }

    public function test_it_returns_provinces(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $hanoi = AdministrativeDivision::factory()->create([
            'country_id' => 1,
            'parent_id' => null,
            'name' => ['vi' => 'Thành phố Hà Nội'],
            'level' => AdministrativeDivisionLevel::PROVINCE,
            'code' => '01',
        ]);

        AdministrativeDivision::factory()->create([
            'country_id' => 1,
            'parent_id' => null,
            'name' => ['vi' => 'Tỉnh Bắc Ninh'],
            'level' => AdministrativeDivisionLevel::PROVINCE,
            'code' => '13',
        ]);

        $response = $this
            ->actingAs($user)
            ->getJson(route('user.addresses.provinces'));

        $response
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    [
                        'id',
                        'name',
                        'code',
                    ],
                ],
            ])
            ->assertJsonFragment([
                'id' => $hanoi->id,
                'name' => 'Thành phố Hà Nội',
                'code' => '01',
            ]);
    }

    public function test_it_returns_districts_for_province(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $province = AdministrativeDivision::factory()->create([
            'country_id' => 1,
            'parent_id' => null,
            'name' => ['vi' => 'Thành phố Hà Nội'],
            'level' => AdministrativeDivisionLevel::PROVINCE,
            'code' => '01',
        ]);

        $district = AdministrativeDivision::factory()->create([
            'country_id' => 1,
            'parent_id' => $province->id,
            'name' => ['vi' => 'Quận Hoàn Kiếm'],
            'level' => AdministrativeDivisionLevel::DISTRICT,
            'code' => '001',
        ]);

        AdministrativeDivision::factory()->create([
            'country_id' => 1,
            'parent_id' => $province->id,
            'name' => ['vi' => 'Quận Tây Hồ'],
            'level' => AdministrativeDivisionLevel::DISTRICT,
            'code' => '003',
        ]);

        $response = $this
            ->actingAs($user)
            ->getJson(route('user.addresses.districts', $province->id));

        $response
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    [
                        'id',
                        'name',
                        'code',
                    ],
                ],
            ])
            ->assertJsonFragment([
                'id' => $district->id,
                'name' => 'Quận Hoàn Kiếm',
                'code' => '001',
            ]);
    }

    public function test_it_returns_wards_for_district(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $province = AdministrativeDivision::factory()->create([
            'country_id' => 1,
            'parent_id' => null,
            'name' => ['vi' => 'Thành phố Hà Nội'],
            'level' => AdministrativeDivisionLevel::PROVINCE,
            'code' => '01',
        ]);

        $district = AdministrativeDivision::factory()->create([
            'country_id' => 1,
            'parent_id' => $province->id,
            'name' => ['vi' => 'Quận Hoàn Kiếm'],
            'level' => AdministrativeDivisionLevel::DISTRICT,
            'code' => '001',
        ]);

        $ward = AdministrativeDivision::factory()->create([
            'country_id' => 1,
            'parent_id' => $district->id,
            'name' => ['vi' => 'Phường Hàng Trống'],
            'level' => AdministrativeDivisionLevel::WARD,
            'code' => '00001',
        ]);

        $response = $this
            ->actingAs($user)
            ->getJson(route('user.addresses.wards', $district->id));

        $response
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    [
                        'id',
                        'name',
                        'code',
                    ],
                ],
            ])
            ->assertJsonFragment([
                'id' => $ward->id,
                'name' => 'Phường Hàng Trống',
                'code' => '00001',
            ]);
    }
}
