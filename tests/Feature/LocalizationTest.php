<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Nút đổi ngôn ngữ / tiền tệ phải thay đổi props Inertia mà storefront dùng
 * (`locale`, `translations`, `currency.code`).
 */
class LocalizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_language_switch_updates_shared_locale_and_translations(): void
    {
        $this->post(route('language.switch'), ['locale' => 'en'])->assertRedirect();

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'en')
            ->where('translations.Add to cart', 'Add to cart')
            ->where('translations.Cart', 'Cart'));
    }

    public function test_vietnamese_translations_are_served_by_default(): void
    {
        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'vi')
            ->where('translations.Add to cart', 'Thêm vào giỏ')
            ->where('translations.Cart', 'Giỏ hàng'));
    }

    public function test_currency_switch_updates_shared_currency(): void
    {
        $this->post(route('currency.switch'), ['currency' => 'USD'])->assertRedirect();

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('currency.code', 'USD'));
    }

    public function test_currency_switch_rejects_unknown_currency(): void
    {
        $this->post(route('currency.switch'), ['currency' => 'XYZ'])
            ->assertSessionHasErrors('currency');

        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('currency.code', 'VND'));
    }
}
