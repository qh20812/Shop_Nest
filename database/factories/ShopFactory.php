<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShopFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->company();
        $slug = \Illuminate\Support\Str::slug($name . '-' . fake()->unique()->randomNumber(4));

        return [
            'owner_id' => User::factory(),
            'name' => $name,
            'slug' => $slug,
            'description' => fake()->paragraphs(2, true),
            'logo' => 'logos/default-shop-logo-' . fake()->numberBetween(1, 10) . '.png',
            'banner' => 'banners/default-shop-banner-' . fake()->numberBetween(1, 10) . '.jpg',
            'phone' => fake()->phoneNumber(),
            'email' => fake()->companyEmail(),
            'website' => fake()->url(),

            // Business information
            'business_type' => fake()->randomElement(['Individual', 'LLC', 'Corporation', 'Partnership']),
            'tax_id' => fake()->numerify('#########'),
            'business_license' => fake()->bothify('LIC-####-????'),

            // Address
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => 'State ' . fake()->numberBetween(1, 50),
            'postal_code' => fake()->postcode(),
            'country' => fake()->country(),

            // Shop settings
            'status' => fake()->randomElement(['pending', 'active', 'suspended', 'inactive']),
            'is_verified' => fake()->boolean(30), // 30% chance of being verified
            'commission_rate' => fake()->randomFloat(2, 5.00, 15.00),

            // Policies
            'shipping_policies' => json_encode([
                'free_shipping_threshold' => fake()->numberBetween(50, 200),
                'standard_delivery_days' => fake()->numberBetween(3, 7),
                'express_delivery_days' => fake()->numberBetween(1, 3),
                'international_shipping' => fake()->boolean(),
            ]),
            'return_policy' => json_encode([
                'return_window_days' => fake()->numberBetween(7, 30),
                'free_returns' => fake()->boolean(),
                'conditions' => fake()->sentence(),
            ]),
            'social_media' => json_encode([
                'facebook' => fake()->url(),
                'instagram' => fake()->url(),
                'twitter' => fake()->url(),
            ]),

            // Performance metrics
            'rating' => fake()->randomFloat(1, 0.00, 5.00),
            'total_reviews' => fake()->numberBetween(0, 1000),
            'total_sales' => fake()->numberBetween(0, 10000),
            'total_revenue' => fake()->randomFloat(2, 0.00, 100000.00),

            // SEO
            'meta_title' => fake()->sentence(8),
            'meta_description' => fake()->paragraph(),
            'keywords' => json_encode(fake()->words(10)),

            // Timestamps
            'verified_at' => fake()->optional(0.3)->dateTimeBetween('-1 year', 'now'),
            'last_active_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }

    /**
     * Create an active and verified shop
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'is_verified' => true,
            'verified_at' => now(),
        ]);
    }

    /**
     * Create a pending shop
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'is_verified' => false,
            'verified_at' => null,
        ]);
    }

    /**
     * Create a shop with high rating
     */
    public function highlyRated(): static
    {
        return $this->state(fn (array $attributes) => [
            'rating' => fake()->randomFloat(1, 4.50, 5.00),
            'total_reviews' => fake()->numberBetween(100, 1000),
        ]);
    }
}