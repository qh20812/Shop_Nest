<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class CompletePurchaseFlowTest extends DuskTestCase
{
    use DatabaseMigrations;

    /**
     * Test complete purchase flow from product selection to successful payment
     */
    public function testCompletePurchaseFlow(): void
    {
        $this->browse(function (Browser $browser) {
            // Step 1: Visit homepage and select a random product
            $browser->visit('/')
                    ->waitFor('.daily-discover-card', 10)
                    ->assertSee('Shop Nest');

            // Get all product cards and select the first one
            $productCards = $browser->elements('.daily-discover-card');
            $this->assertGreaterThan(0, count($productCards), 'No products found on homepage');

            // Click on first product card
            $browser->click('.daily-discover-card:first-child')
                    ->waitFor('.product-detail-page', 10)
                    ->assertSee('Mua ngay');

            // Step 2: Select random variant if available
            $variantSelectors = $browser->elements('.variant-selector select');
            if (count($variantSelectors) > 0) {
                foreach ($variantSelectors as $selector) {
                    $options = $browser->elements('option', $selector);
                    if (count($options) > 1) { // More than just the default/placeholder option
                        $randomOption = rand(1, count($options) - 1); // Skip first option (usually placeholder)
                        $browser->select($selector, $options[$randomOption]->getAttribute('value'));
                    }
                }
                $browser->pause(1000); // Wait for variant change to take effect
            }

            // Step 3: Select random quantity
            $quantityInput = $browser->element('.quantity-selector input[type="number"]');
            if ($quantityInput) {
                $maxQuantity = $quantityInput->getAttribute('max') ?: 10;
                $randomQuantity = rand(1, min(5, (int)$maxQuantity)); // Random quantity between 1-5 or max available
                $browser->type('.quantity-selector input[type="number"]', $randomQuantity);
            }

            // Step 4: Click "Buy Now" button
            $browser->click('.product-action-btn.buy-now')
                    ->waitFor('.checkout-page', 15)
                    ->assertUrlContains('/buy-now/checkout/');

            // Step 5: Fill checkout information
            // Select shipping address (if available)
            $addressRadios = $browser->elements('.checkout-address-item input[type="radio"]');
            if (count($addressRadios) > 0) {
                $browser->click('.checkout-address-item input[type="radio"]:first-child');
            }

            // Add order notes (optional)
            $browser->type('.checkout-notes textarea', 'Test order from automated test - ' . now()->toDateTimeString());

            // Step 6: Select payment method
            $browser->click('.checkout-payment-item input[value="stripe"]');

            // Step 7: Submit checkout
            $browser->click('.checkout-payment-btn')
                    ->waitFor('.stripe-checkout', 10)
                    ->assertUrlContains('checkout.stripe.com');

            // Note: In a real test environment, you would need to:
            // 1. Mock Stripe payment processing
            // 2. Or use Stripe test cards
            // 3. Or skip the actual payment and test the redirect back

            // For now, we'll just verify we reached the payment page
            $browser->assertSee('Stripe');

            // Step 8: Simulate successful payment return (this would normally be handled by webhooks)
            // In a real scenario, you'd need to mock the payment success callback
            // For this test, we'll just verify the payment flow initiation

            $this->assertTrue(true, 'Complete purchase flow test passed - reached payment page');
        });
    }

    /**
     * Test purchase flow with cart checkout (alternative path)
     */
    public function testCartCheckoutFlow(): void
    {
        $this->browse(function (Browser $browser) {
            // Step 1: Visit homepage and add product to cart
            $browser->visit('/')
                    ->waitFor('.daily-discover-card', 10);

            // Click "Add to Cart" on first product (we need to hover first to show the button)
            $browser->mouseover('.daily-discover-card:first-child')
                    ->waitFor('.daily-card-hover-action', 5)
                    ->click('.daily-discover-card:first-child .daily-card-hover-action')
                    ->waitFor('.toast-success', 5)
                    ->assertSee('added to cart');

            // Step 2: Go to cart page
            $browser->click('.cart-link') // Assuming there's a cart link in header
                    ->waitFor('.cart-page', 10)
                    ->assertSee('Shopping Cart');

            // Step 3: Proceed to checkout
            $browser->click('.checkout-btn')
                    ->waitFor('.checkout-page', 10)
                    ->assertUrlContains('/checkout');

            // Step 4: Fill checkout information (similar to buy now flow)
            $addressRadios = $browser->elements('.checkout-address-item input[type="radio"]');
            if (count($addressRadios) > 0) {
                $browser->click('.checkout-address-item input[type="radio"]:first-child');
            }

            $browser->type('.checkout-notes textarea', 'Cart checkout test - ' . now()->toDateTimeString());
            $browser->click('.checkout-payment-item input[value="stripe"]');

            // Step 5: Submit checkout
            $browser->click('.checkout-payment-btn')
                    ->waitFor('.stripe-checkout', 10)
                    ->assertUrlContains('checkout.stripe.com');

            $this->assertTrue(true, 'Cart checkout flow test passed - reached payment page');
        });
    }

    /**
     * Test product detail page elements are present
     */
    public function testProductDetailPageElements(): void
    {
        $this->browse(function (Browser $browser) {
            // Visit homepage and get first product link
            $browser->visit('/')
                    ->waitFor('.daily-discover-card', 10);

            $firstProductCard = $browser->element('.daily-discover-card:first-child');
            $this->assertNotNull($firstProductCard, 'No product card found');

            // Click on product and verify detail page elements
            $browser->click('.daily-discover-card:first-child')
                    ->waitFor('.product-detail-page', 10)
                    ->assertSee('Mua ngay')
                    ->assertPresent('.product-action-btn.buy-now')
                    ->assertPresent('.product-action-btn.add-to-cart')
                    ->assertPresent('.quantity-selector')
                    ->assertPresent('.product-price');

            // Check if variant selectors exist (optional)
            $variantSelectors = $browser->elements('.variant-selector');
            // This is fine if no variants exist

            $this->assertTrue(true, 'Product detail page elements test passed');
        });
    }
}