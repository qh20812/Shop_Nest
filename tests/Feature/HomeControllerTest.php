<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\FlashSaleEvent;
use App\Models\FlashSaleProduct;
use App\Models\UserPreference;

class HomeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_loads_successfully()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_home_page_returns_categories()
    {
        // Create test categories
        Category::factory()->create([
            'name' => ['vi' => 'Test Category', 'en' => 'Test Category'],
            'image_url' => 'test-image.jpg',
            'is_active' => true,
        ]);

        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('categories')
                 ->where('categories.0.name', 'Test Category')
        );
    }

    public function test_home_page_returns_flash_sale_data()
    {
        // Create flash sale event
        $flashSaleEvent = FlashSaleEvent::factory()->create([
            'status' => 'active',
            'start_time' => now()->subHour(),
            'end_time' => now()->addHour(),
        ]);

        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('flashSale')
        );
    }

    public function test_home_page_returns_daily_discover_for_guest()
    {
        // Create test products
        Product::factory()->count(5)->create([
            'is_active' => true,
            'status' => 'published',
        ]);

        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('dailyDiscover')
        );
    }

    public function test_home_page_returns_personalized_daily_discover_for_user()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        
        // Create user preference
        UserPreference::factory()->create([
            'user_id' => $user->id,
            'preferred_category_id' => $category->category_id,
        ]);

        // Create products in preferred category
        Product::factory()->count(3)->create([
            'category_id' => $category->category_id,
            'is_active' => true,
            'status' => 'published',
        ]);

        $response = $this->actingAs($user)->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('dailyDiscover')
                 ->has('user')
                 ->where('user.id', $user->id)
        );
    }

    public function test_home_page_returns_null_user_for_guest()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->where('user', null)
        );
    }

    public function test_home_page_returns_user_data_for_authenticated_user()
    {
        $user = User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
        ]);

        $response = $this->actingAs($user)->get('/');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('user')
                 ->where('user.username', 'testuser')
                 ->where('user.email', 'test@example.com')
        );
    }
}
