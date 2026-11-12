<?php

namespace Tests\Feature\User;

use App\Enums\AdministrativeDivisionLevel;
use App\Models\AdministrativeDivision;
use App\Models\Country;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MyAddressTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Country $vietnam;

    protected function setUp(): void
    {
        parent::setUp();

        $this->vietnam = Country::factory()->create([
            'iso_code_2' => 'VN',
            'name' => ['vi' => 'Việt Nam', 'en' => 'Vietnam'],
        ]);

        $this->user = User::factory()->create(['email_verified_at' => now()]);
        $this->actingAs($this->user);
    }

    private function createLocationHierarchy(): array
    {
        $province = AdministrativeDivision::factory()->create([
            'country_id' => $this->vietnam->id,
            'parent_id' => null,
            'name' => ['vi' => 'Thành phố Hà Nội'],
            'code' => '01',
            'level' => AdministrativeDivisionLevel::PROVINCE,
        ]);

        $district = AdministrativeDivision::factory()->create([
            'country_id' => $this->vietnam->id,
            'parent_id' => $province->id,
            'name' => ['vi' => 'Quận Hoàn Kiếm'],
            'code' => '001',
            'level' => AdministrativeDivisionLevel::DISTRICT,
        ]);

        $ward = AdministrativeDivision::factory()->create([
            'country_id' => $this->vietnam->id,
            'parent_id' => $district->id,
            'name' => ['vi' => 'Phường Hàng Trống'],
            'code' => '00001',
            'level' => AdministrativeDivisionLevel::WARD,
        ]);

        return compact('province', 'district', 'ward');
    }

    public function test_user_can_view_address_index(): void
    {
        UserAddress::factory()->count(3)->create(['user_id' => $this->user->id]);

        $this->get(route('user.addresses.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Customer/Address/Index')
                ->has('addresses', 3));
    }

    public function test_unauthenticated_user_cannot_view_addresses(): void
    {
        auth()->logout();

        $this->get(route('user.addresses.index'))->assertRedirect('/login');
    }

    public function test_store_creates_address_and_updates_default_flag(): void
    {
        $location = $this->createLocationHierarchy();

        $response = $this->post(route('user.addresses.store'), [
            'name' => 'John Doe',
            'phone' => '0123456789',
            'address' => '123 Main St',
            'province_id' => $location['province']->id,
            'ward_id' => $location['ward']->id,
            'is_default' => true,
        ]);

        $response->assertRedirect(route('user.addresses.index'))->assertSessionHas('success');

        $this->assertDatabaseHas('user_addresses', [
            'user_id' => $this->user->id,
            'full_name' => 'John Doe',
            'phone_number' => '0123456789',
            'street_address' => '123 Main St',
            'province_id' => $location['province']->id,
            'district_id' => null,
            'ward_id' => $location['ward']->id,
            'country_id' => $this->vietnam->id,
            'is_default' => true,
        ]);

        $this->assertEquals(1, UserAddress::where('user_id', $this->user->id)->where('is_default', true)->count());
    }

    public function test_store_validation_fails_with_invalid_data(): void
    {
        $this->post(route('user.addresses.store'), [])
            ->assertRedirect()
            ->assertSessionHasErrors(['name', 'phone', 'address', 'province_id', 'ward_id']);
    }

    public function test_update_modifies_existing_address(): void
    {
        $location = $this->createLocationHierarchy();
        $address = UserAddress::factory()->create(['user_id' => $this->user->id]);

        $this->put(route('user.addresses.update', $address), [
            'name' => 'Jane Doe',
            'phone' => '0987654321',
            'address' => '456 Elm St',
            'province_id' => $location['province']->id,
            'ward_id' => $location['ward']->id,
            'is_default' => false,
        ])->assertRedirect(route('user.addresses.index'))->assertSessionHas('success');

        $this->assertDatabaseHas('user_addresses', [
            'id' => $address->id,
            'full_name' => 'Jane Doe',
            'phone_number' => '0987654321',
            'street_address' => '456 Elm St',
        ]);
    }

    public function test_update_sets_new_default_and_unsets_others(): void
    {
        $location = $this->createLocationHierarchy();

        $address1 = UserAddress::factory()->create(['user_id' => $this->user->id, 'is_default' => true]);
        $address2 = UserAddress::factory()->create(['user_id' => $this->user->id, 'is_default' => false]);

        $this->put(route('user.addresses.update', $address2), [
            'name' => $address2->full_name,
            'phone' => $address2->phone_number,
            'address' => $address2->street_address,
            'province_id' => $location['province']->id,
            'ward_id' => $location['ward']->id,
            'is_default' => true,
        ]);

        $this->assertFalse($address1->fresh()->is_default);
        $this->assertTrue($address2->fresh()->is_default);
    }

    public function test_destroy_deletes_address(): void
    {
        $address = UserAddress::factory()->create(['user_id' => $this->user->id]);

        $this->delete(route('user.addresses.destroy', $address))
            ->assertRedirect(route('user.addresses.index'))
            ->assertSessionHas('success');

        $this->assertSoftDeleted('user_addresses', ['id' => $address->id]);
    }

    public function test_destroy_transfers_default_to_another_address(): void
    {
        $address1 = UserAddress::factory()->create(['user_id' => $this->user->id, 'is_default' => true]);
        $address2 = UserAddress::factory()->create(['user_id' => $this->user->id, 'is_default' => false]);

        $this->delete(route('user.addresses.destroy', $address1));

        $this->assertTrue($address2->fresh()->is_default);
    }

    public function test_set_default_updates_address_default_flag(): void
    {
        $address = UserAddress::factory()->create(['user_id' => $this->user->id, 'is_default' => false]);

        $this->patch(route('user.addresses.set-default', $address))
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertTrue($address->fresh()->is_default);
    }

    public function test_user_cannot_access_another_users_address(): void
    {
        $otherUser = User::factory()->create();
        $address = UserAddress::factory()->create(['user_id' => $otherUser->id]);

        $this->get(route('user.addresses.show', $address))->assertStatus(403);
    }

    public function test_provinces_returns_correct_data(): void
    {
        $hanoi = AdministrativeDivision::factory()->create([
            'country_id' => $this->vietnam->id,
            'parent_id' => null,
            'name' => ['vi' => 'Hà Nội'],
            'code' => 'HN',
            'level' => AdministrativeDivisionLevel::PROVINCE,
        ]);

        $this->getJson(route('user.addresses.provinces', $this->vietnam->id))
            ->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonFragment(['id' => $hanoi->id, 'name' => 'Hà Nội', 'code' => 'HN']);
    }

    public function test_districts_returns_correct_data(): void
    {
        $location = $this->createLocationHierarchy();

        $this->getJson(route('user.addresses.districts', $location['province']->id))
            ->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonFragment([
                'id' => $location['district']->id,
                'name' => 'Quận Hoàn Kiếm',
                'code' => '001',
            ]);
    }

    public function test_wards_returns_correct_data(): void
    {
        $location = $this->createLocationHierarchy();

        $this->getJson(route('user.addresses.wards', $location['district']->id))
            ->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonFragment([
                'id' => $location['ward']->id,
                'name' => 'Phường Hàng Trống',
                'code' => '00001',
            ]);
    }
}
