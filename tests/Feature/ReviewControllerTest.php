<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Review;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReviewControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $product;
    protected $variant;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();

        $this->product = Product::factory()->create();
        $this->variant = ProductVariant::factory()->create([
            'product_id' => $this->product->product_id,
        ]);
    }

    /** @test */
    public function it_returns_reviews_for_logged_in_user()
    {
        Review::factory()->create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->product_id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/dashboard/reviews');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    /** @test */
    public function it_returns_empty_list_if_no_reviews()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/dashboard/reviews');

        $response->assertStatus(200)
                 ->assertJson(['data' => []]);
    }

    /** @test */
    public function it_requires_authentication_for_index()
    {
        $response = $this->getJson('/dashboard/reviews');
        $response->assertStatus(401);
    }

    /** @test */
    public function it_can_create_review_form_if_order_and_product_valid()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $order->items()->create([
            'order_id' => $order->order_id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
            'price' => 100000,
            'total' => 100000,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/create/{$order->order_id}/{$this->product->product_id}");

        $response->assertStatus(200)
                 ->assertJsonStructure(['order', 'product']);
    }

    /** @test */
    public function it_fails_if_order_not_found()
    {
        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/create/999/{$this->product->product_id}");

        $response->assertStatus(404);
    }

    /** @test */
    public function it_fails_if_order_not_belong_to_user()
    {
        $otherUser = User::factory()->create();
        $order = Order::factory()->create(['customer_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/create/{$order->order_id}/{$this->product->product_id}");

        $response->assertStatus(404);
    }

    /** @test */
    public function it_fails_if_product_not_found()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/create/{$order->order_id}/999999");

        $response->assertStatus(404);
    }

    /** @test */
    public function it_fails_if_product_not_in_order()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/create/{$order->order_id}/{$this->product->product_id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function it_can_store_review_successfully()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $order->items()->create([
            'order_id' => $order->order_id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
            'price' => 100000,
            'total' => 100000,
        ]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", [
                'rating' => 5,
                'comment' => 'Good product'
            ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['is_approved' => false]);
    }

    /** @test */
    public function it_fails_if_already_reviewed_product()
    {
        Review::factory()->create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->product_id,
        ]);

        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", [
                'rating' => 4,
                'comment' => 'Duplicate'
            ]);

        $response->assertStatus(400);
    }

    /** @test */
    public function it_requires_rating_when_storing()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", []);

        $response->assertStatus(422);
    }

    /** @test */
    public function it_validates_rating_minimum_and_maximum()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", ['rating' => 0]);
        $response->assertStatus(422);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", ['rating' => 6]);
        $response->assertStatus(422);
    }

    /** @test */
    public function it_validates_comment_length()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);
        $longComment = str_repeat('a', 2001);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", [
                'rating' => 4,
                'comment' => $longComment
            ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function it_allows_null_comment()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", [
                'rating' => 5,
                'comment' => null
            ]);

        $response->assertStatus(201);
    }

    /** @test */
    public function it_fails_if_product_does_not_exist()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/999999", ['rating' => 5]);

        $response->assertStatus(404);
    }

    /** @test */
    public function it_requires_authentication_for_store()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", ['rating' => 5]);
        $response->assertStatus(401);
    }

    /** @test */
    public function it_returns_review_detail_if_user_owns_it()
    {
        $review = Review::factory()->create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->product_id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/{$review->review_id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['review_id' => $review->review_id]);
    }

    /** @test */
    public function it_fails_if_review_does_not_exist_or_not_owned()
    {
        $otherReview = Review::factory()->create();

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/{$otherReview->review_id}");

        $response->assertStatus(404);
    }
}
