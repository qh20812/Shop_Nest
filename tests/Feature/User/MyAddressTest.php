<?php

namespace Tests\Feature\User;

use App\Models\User;
use App\Models\UserAddress;
use App\Models\AdministrativeDivision;
use App\Models\Country;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MyAddressTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(['email_verified_at' => now()]);
        $this->actingAs($this->user);
    }

    public function test_user_can_view_address_index()
    {
        UserAddress::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->get(route('user.addresses.index'));

        $response->assertStatus(200)
                 ->assertInertia(fn ($page) => $page
                     ->component('Customer/Profile/Address')
                     ->has('addresses', 3));
    }

    public function test_unauthenticated_user_cannot_view_addresses()
    {
        $this->withoutExceptionHandling();

        $response = $this->get(route('user.addresses.index'));

        $response->assertRedirect('/login');
    }

    public function test_store_creates_address_and_updates_default_flag()
    {
        $locationData = $this->createLocationHierarchy();

        $addressData = [
            'full_name' => 'John Doe',
            'phone_number' => '0123456789',
            'street_address' => '123 Main St',
            'province_id' => $locationData['province']->id,
            'district_id' => $locationData['district']->id,
            'ward_id' => $locationData['ward']->id,
            'postal_code' => '10000',
            'is_default' => true,
        ];

        $response = $this->post(route('user.addresses.store'), $addressData);

        $response->assertRedirect(route('user.addresses.index'))
                 ->assertSessionHas('success');

        $this->assertDatabaseHas('user_addresses', [
            'user_id' => $this->user->id,
            'full_name' => 'John Doe',
            'phone_number' => '0123456789',
            'street_address' => '123 Main St',
            'province_id' => $locationData['province']->id,
            'district_id' => $locationData['district']->id,
            'ward_id' => $locationData['ward']->id,
            'postal_code' => '10000',
            'is_default' => true,
        ]);

        // Ensure only one default address
        $this->assertEquals(1, UserAddress::where('user_id', $this->user->id)->where('is_default', true)->count());
    }

    public function test_store_validation_fails_with_invalid_data()
    {
        $response = $this->post(route('user.addresses.store'), []);

        $response->assertRedirect()
                 ->assertSessionHasErrors(['full_name', 'phone_number', 'street_address', 'province_id', 'district_id', 'ward_id']);
    }

    public function test_update_modifies_existing_address()
    {
        $locationData = $this->createLocationHierarchy();
        $address = UserAddress::factory()->create(['user_id' => $this->user->id]);

        $updateData = [
            'full_name' => 'Jane Doe',
            'phone_number' => '0987654321',
            'street_address' => '456 Elm St',
            'province_id' => $locationData['province']->id,
            'district_id' => $locationData['district']->id,
            'ward_id' => $locationData['ward']->id,
            'postal_code' => '20000',
            'is_default' => false,
        ];

        $response = $this->put(route('user.addresses.update', $address), $updateData);

        $response->assertRedirect(route('user.addresses.index'))
                 ->assertSessionHas('success');

        $this->assertDatabaseHas('user_addresses', [
            'id' => $address->id,
            'full_name' => 'Jane Doe',
            'phone_number' => '0987654321',
            'street_address' => '456 Elm St',
            'postal_code' => '20000',
        ]);
    }

    public function test_update_sets_new_default_and_unsets_others()
    {
        $address1 = UserAddress::factory()->create(['user_id' => $this->user->id, 'is_default' => true]);
        $address2 = UserAddress::factory()->create(['user_id' => $this->user->id, 'is_default' => false]);

        $updateData = [
            'full_name' => $address2->full_name,
            'phone_number' => $address2->phone_number,
            'street_address' => $address2->street_address,
            'province_id' => $address2->province_id,
            'district_id' => $address2->district_id,
            'ward_id' => $address2->ward_id,
            'postal_code' => $address2->postal_code,
            'is_default' => true,
        ];

        $this->put(route('user.addresses.update', $address2), $updateData);

        $address1 = $address1->fresh();
        $address2 = $address2->fresh();

        $this->assertFalse($address1->is_default);
        $this->assertTrue($address2->is_default);
    }

    public function test_destroy_deletes_address()
    {
        $address = UserAddress::factory()->create(['user_id' => $this->user->id]);

        $response = $this->delete(route('user.addresses.destroy', $address));

        $response->assertRedirect(route('user.addresses.index'))
                 ->assertSessionHas('success');

        $this->assertSoftDeleted('user_addresses', ['id' => $address->id]);
    }

    public function test_destroy_transfers_default_to_another_address()
    {
        $address1 = UserAddress::factory()->create(['user_id' => $this->user->id, 'is_default' => true]);
        $address2 = UserAddress::factory()->create(['user_id' => $this->user->id, 'is_default' => false]);

        $this->delete(route('user.addresses.destroy', $address1));

        $address2->refresh();
        $this->assertTrue($address2->is_default);
    }

    public function test_set_default_updates_address_default_flag()
    {
        $address = UserAddress::factory()->create(['user_id' => $this->user->id, 'is_default' => false]);

        $response = $this->patch(route('user.addresses.set-default', $address));

        $response->assertRedirect()
                 ->assertSessionHas('success');

        $address->refresh();
        $this->assertTrue($address->is_default);
    }

    public function test_user_cannot_access_another_users_address()
    {
        $otherUser = User::factory()->create();
        $address = UserAddress::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->get(route('user.addresses.show', $address));

        $response->assertStatus(403);
    }

    public function test_provinces_returns_correct_data()
    {
        $country = Country::create(['name' => ['vi' => 'Việt Nam'], 'iso_code_2' => 'VN']);
        AdministrativeDivision::create(['country_id' => $country->id, 'name' => ['vi' => 'Hà Nội'], 'code' => 'HN', 'level' => 1, 'parent_id' => null]);

        $response = $this->get(route('user.addresses.provinces'));

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         ['id' => 1, 'name' => 'Hà Nội', 'code' => 'HN']
                     ]
                 ]);
    }

    public function test_districts_returns_correct_data()
    {
        $country = Country::create(['name' => ['vi' => 'Việt Nam'], 'iso_code_2' => 'VN']);
        $province = AdministrativeDivision::create(['country_id' => $country->id, 'name' => ['vi' => 'Hà Nội'], 'code' => 'HN', 'level' => 1, 'parent_id' => null]);
        AdministrativeDivision::create(['country_id' => $country->id, 'name' => ['vi' => 'Ba Đình'], 'code' => 'BD', 'level' => 2, 'parent_id' => $province->id]);

        $response = $this->get(route('user.addresses.districts', $province->id));

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         ['id' => 2, 'name' => 'Ba Đình', 'code' => 'BD']
                     ]
                 ]);
    }

    public function test_wards_returns_correct_data()
    {
        $country = Country::create(['name' => ['vi' => 'Việt Nam'], 'iso_code_2' => 'VN']);
        $province = AdministrativeDivision::create(['country_id' => $country->id, 'name' => ['vi' => 'Hà Nội'], 'code' => 'HN', 'level' => 1, 'parent_id' => null]);
        $district = AdministrativeDivision::create(['country_id' => $country->id, 'name' => ['vi' => 'Ba Đình'], 'code' => 'BD', 'level' => 2, 'parent_id' => $province->id]);
        AdministrativeDivision::create(['country_id' => $country->id, 'name' => ['vi' => 'Phúc Xá'], 'code' => 'PX', 'level' => 3, 'parent_id' => $district->id]);

        $response = $this->get(route('user.addresses.wards', $district->id));

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'data' => [
                         ['id' => 3, 'name' => 'Phúc Xá', 'code' => 'PX']
                     ]
                 ]);
    }

    private function createLocationHierarchy(): array
    {
        $country = Country::create([
            'name' => ['vi' => 'Việt Nam'],
            'iso_code_2' => 'VN',
        ]);

        $province = AdministrativeDivision::create([
            'country_id' => $country->id,
            'name' => ['vi' => 'Test Province'],
            'code' => 'TP',
            'level' => 1,
            'parent_id' => null,
        ]);

        $district = AdministrativeDivision::create([
            'country_id' => $country->id,
            'name' => ['vi' => 'Test District'],
            'code' => 'TD',
            'level' => 2,
            'parent_id' => $province->id,
        ]);

        $ward = AdministrativeDivision::create([
            'country_id' => $country->id,
            'name' => ['vi' => 'Test Ward'],
            'code' => 'TW',
            'level' => 3,
            'parent_id' => $district->id,
        ]);

        return compact('province', 'district', 'ward');
    }
}
