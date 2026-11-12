<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $this->seed(RoleSeeder::class);

        $admin = User::factory()->create();
        $admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        $this->actingAs($admin)->get(route('admin.dashboard'))->assertOk();
    }
}
