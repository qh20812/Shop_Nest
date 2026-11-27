<?php

namespace Tests\Feature\Console;

use App\Mail\LowStockMail;
use App\Mail\OrderStatusMail;
use App\Mail\ShopStatusMail;
use App\Mail\VerifyEmailMail;
use App\Mail\WelcomeEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Tests\TestCase;

class PreviewMailCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_sends_every_preview_mail_and_routes_seller_mail_separately(): void
    {
        Mail::fake();

        $this->artisan('mail:preview', [
            'to' => 'customer@example.com',
            '--seller-to' => 'seller@example.com',
        ])->assertSuccessful();

        Mail::assertSentCount(19);

        Mail::assertSent(WelcomeEmail::class, fn (WelcomeEmail $mail) => $mail->hasTo('customer@example.com'));
        Mail::assertSent(ShopStatusMail::class, 4);
        Mail::assertSent(OrderStatusMail::class, 8);
        Mail::assertSent(LowStockMail::class, fn (LowStockMail $mail) => $mail->hasTo('seller@example.com'));
    }

    public function test_it_prefixes_the_subject_for_easy_filtering(): void
    {
        Mail::fake();

        $this->artisan('mail:preview', [
            'to' => 'customer@example.com',
            '--seller-to' => 'seller@example.com',
            '--only' => 'welcome,shop-approved',
        ])->assertSuccessful();

        Mail::assertSent(WelcomeEmail::class, function (WelcomeEmail $mail) {
            return Str::startsWith((string) $mail->subject, '[ShopNest PREVIEW · customer 1/1] ')
                && str_contains((string) $mail->subject, 'Chào mừng');
        });

        Mail::assertSent(ShopStatusMail::class, function (ShopStatusMail $mail) {
            return Str::startsWith((string) $mail->subject, '[ShopNest PREVIEW · seller 1/1] ')
                && $mail->hasTo('seller@example.com');
        });
    }

    public function test_seller_group_only_sends_seller_mail(): void
    {
        Mail::fake();

        $this->artisan('mail:preview', [
            'to' => 'customer@example.com',
            '--seller-to' => 'seller@example.com',
            '--group' => 'seller',
        ])->assertSuccessful();

        Mail::assertSentCount(5);
        Mail::assertSent(ShopStatusMail::class, 4);
        Mail::assertSent(LowStockMail::class, 1);
        Mail::assertSent(WelcomeEmail::class, 0);
        Mail::assertSent(OrderStatusMail::class, 0);
    }

    public function test_seller_mail_falls_back_to_the_main_recipient(): void
    {
        Mail::fake();

        $this->artisan('mail:preview', [
            'to' => 'both@example.com',
            '--group' => 'inventory',
        ])->assertSuccessful();

        Mail::assertSent(LowStockMail::class, fn (LowStockMail $mail) => $mail->hasTo('both@example.com'));
    }

    public function test_only_option_filters_by_slug(): void
    {
        Mail::fake();

        $this->artisan('mail:preview', [
            'to' => 'customer@example.com',
            '--seller-to' => 'seller@example.com',
            '--only' => 'verify,low-stock',
        ])->assertSuccessful();

        Mail::assertSentCount(2);

        Mail::assertSent(VerifyEmailMail::class, function (VerifyEmailMail $mail) {
            return $mail->hasTo('customer@example.com')
                && str_contains($mail->subject, 'Xác thực email');
        });
        Mail::assertSent(LowStockMail::class, fn (LowStockMail $mail) => $mail->hasTo('seller@example.com'));
    }

    public function test_list_option_does_not_send_mail(): void
    {
        Mail::fake();

        $this->artisan('mail:preview', ['--list' => true])
            ->expectsOutputToContain('low-stock')
            ->assertSuccessful();

        Mail::assertNothingSent();
    }

    public function test_it_rejects_an_invalid_recipient(): void
    {
        Mail::fake();

        $this->artisan('mail:preview', ['to' => 'not-an-email'])->assertFailed();

        Mail::assertNothingSent();
    }
}
