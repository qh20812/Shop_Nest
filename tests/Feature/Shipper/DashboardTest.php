<?php

namespace Tests\Feature\Shipper;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_shipper_can_open_dashboard(): void
    {
        $this->seed(RoleSeeder::class);

        $shipper = User::factory()->create();
        $shipper->roles()->attach(Role::where('name->en', 'Shipper')->first());

        $this->actingAs($shipper)
            ->get('/shipper/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Shipper/Dashboard/Index')
                ->where('title', 'Shipper Dashboard'));
    }
}
