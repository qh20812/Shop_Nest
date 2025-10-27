<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SellerRoutesAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_seller_can_access_seller_routes()
    {
        $seller = User::factory()->create();
        // create Seller role and attach
        if (method_exists($seller, 'roles')) {
            $role = Role::create([
                'name' => ['en' => 'Seller'],
                'description' => ['en' => 'Seller role']
            ]);
            $seller->roles()->attach($role->id);
        } else {
            $seller->role = 'seller';
            $seller->save();
        }

        $this->actingAs($seller)
            ->get('/seller/dashboard')
            ->assertStatus(200);
    }

    public function test_non_seller_is_redirected_or_forbidden()
    {
        $user = User::factory()->create();
        $this->actingAs($user)
            ->get('/seller/dashboard')
            ->assertRedirect('/dashboard');
    }

    public function test_ajax_non_seller_gets_403()
    {
        $user = User::factory()->create();
        $this->actingAs($user)
            ->getJson('/seller/dashboard')
            ->assertStatus(403)
            ->assertJson(['message' => 'Forbidden. You do not have seller access.']);
    }
}
