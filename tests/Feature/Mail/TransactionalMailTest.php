<?php

namespace Tests\Feature\Mail;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Mail\OrderStatusMail;
use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmailMail;
use App\Mail\WelcomeEmail;
use App\Mail\WelcomeGoogleUserMail;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Shop;
use App\Models\User;
use App\Notifications\LowStockNotification;
use App\Notifications\OrderStatusNotification;
use App\Notifications\ShopApprovedNotification;
use App\Notifications\VerifyEmailNotification;
use App\Services\Admin\ShopManagementService;
use App\Services\InventoryService;
use Database\Seeders\RoleSeeder;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class TransactionalMailTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_welcome_email_is_sent_after_verification_not_at_registration(): void
    {
        Mail::fake();
        Notification::fake();

        $this->post(route('register.store'), [
            'identifier' => 'new.customer@example.com',
            'password' => 'Password123!',
            'confirmPassword' => 'Password123!',
            'agreeToTerms' => true,
        ])->assertRedirect(route('verification.notice'));

        $user = User::where('email', 'new.customer@example.com')->firstOrFail();

        Mail::assertNotQueued(WelcomeEmail::class);
        Notification::assertSentTo($user, VerifyEmailNotification::class);

        $url = URL::temporarySignedRoute('verification.verify', now()->addMinutes(60), [
            'id' => $user->getKey(),
            'hash' => sha1($user->getEmailForVerification()),
        ]);

        $this->actingAs($user)->get($url)->assertRedirect();

        Mail::assertQueued(WelcomeEmail::class, fn (WelcomeEmail $mail) => $mail->user->is($user));
    }

    public function test_welcome_email_content_is_vietnamese_and_points_to_the_shop(): void
    {
        app()->setLocale('vi');

        $user = $this->makeUser(['first_name' => 'Minh', 'last_name' => 'Nguyen']);

        $html = (string) (new WelcomeEmail($user))->render();

        $this->assertStringContainsString('Chào mừng bạn đến với ShopNest', $html);
        $this->assertStringContainsString('Minh Nguyen', $html);
        $this->assertStringContainsString('Vào ShopNest', $html);
        $this->assertStringContainsString('/image/ShopnestLogo.png', $html);
    }

    public function test_verification_email_is_localized_and_mentions_the_expiry(): void
    {
        app()->setLocale('vi');

        $user = $this->makeUser(['first_name' => 'Minh', 'last_name' => 'Nguyen']);

        $mail = (new VerifyEmailNotification)->toMail($user);

        $this->assertInstanceOf(VerifyEmailMail::class, $mail);

        $html = (string) $mail->render();

        $this->assertStringContainsString('Xác thực email', $html);
        $this->assertStringContainsString('Minh Nguyen', $html);
        $this->assertStringContainsString('60 phút', $html);
        $this->assertStringNotContainsString('Verify Email Address', $html);
    }

    public function test_reset_password_email_is_localized(): void
    {
        app()->setLocale('vi');

        $user = $this->makeUser();

        $mail = (new ResetPassword('token-123'))->toMail($user);

        $this->assertInstanceOf(ResetPasswordMail::class, $mail);

        $html = (string) $mail->render();

        $this->assertStringContainsString('Đặt lại mật khẩu', $html);
        $this->assertStringContainsString('60 phút', $html);
        $this->assertStringNotContainsString('Reset your password', $html);
    }

    public function test_google_welcome_email_never_contains_a_password(): void
    {
        app()->setLocale('vi');

        $user = $this->makeUser(['provider' => 'google']);

        $html = (string) (new WelcomeGoogleUserMail($user))->render();

        $this->assertStringContainsString('Đăng nhập bằng Google', $html);
        $this->assertStringNotContainsString('Mật khẩu tạm thời', $html);
        $this->assertStringNotContainsString('Temporary Password', $html);
    }

    public function test_shop_approval_sends_a_localized_mail_to_the_seller(): void
    {
        Notification::fake();

        $admin = User::factory()->create();
        $this->actingAs($admin);

        $seller = $this->makeUser(['username' => 'bepnhaminh', 'shop_status' => 'pending']);
        Shop::factory()->create(['owner_id' => $seller->id, 'name' => 'Bếp Nhà Minh']);

        app(ShopManagementService::class)->approve($seller);

        Notification::assertSentTo($seller, ShopApprovedNotification::class, function (ShopApprovedNotification $notification) use ($seller) {
            app()->setLocale('vi');
            $html = (string) $notification->toMail($seller)->render();

            return str_contains($html, 'Bếp Nhà Minh')
                && str_contains($html, 'Quản lý shop')
                && str_contains($html, '/seller/shop');
        });
    }

    public function test_low_stock_mail_is_sent_once_per_low_stock_event_and_points_to_the_seller_product(): void
    {
        Notification::fake();

        $seller = $this->makeUser();
        $product = Product::factory()->create(['seller_id' => $seller->id]);
        $variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'stock_quantity' => 20,
            'track_inventory' => true,
            'allow_backorder' => false,
        ]);

        $service = app(InventoryService::class);

        $service->adjustStock($variant->variant_id, -12, 'sale');
        Notification::assertSentToTimes($seller, LowStockNotification::class, 1);

        // Bán thêm nhưng vẫn dưới ngưỡng → không gửi lại.
        $service->adjustStock($variant->variant_id, -1, 'sale');
        Notification::assertSentToTimes($seller, LowStockNotification::class, 1);

        // Nhập thêm hàng → mở lại chu kỳ cảnh báo.
        $service->setStock($variant->variant_id, 50, 'restock');
        $this->assertNull($variant->fresh()->low_stock_notified_at);

        $service->adjustStock($variant->variant_id, -45, 'sale');
        Notification::assertSentToTimes($seller, LowStockNotification::class, 2);

        $mail = Notification::sent($seller, LowStockNotification::class)->last()->toMail($seller);
        $this->assertStringContainsString('/seller/products/'.$product->product_id.'/edit', $mail->url);
    }

    public function test_order_status_changes_notify_the_customer(): void
    {
        Notification::fake();

        $customer = $this->makeUser();
        $order = Order::factory()->create([
            'customer_id' => $customer->id,
            'status' => OrderStatus::PENDING_CONFIRMATION,
            'payment_status' => PaymentStatus::UNPAID,
        ]);

        $this->assertSame('placed', $this->lastOrderEvent($customer));

        // Bước nội bộ không gửi mail.
        $order->update(['status' => OrderStatus::ASSIGNED_TO_SHIPPER]);
        $this->assertSame('placed', $this->lastOrderEvent($customer));

        $order->update(['status' => OrderStatus::DELIVERING]);
        $this->assertSame('delivering', $this->lastOrderEvent($customer));

        $order->update(['status' => OrderStatus::DELIVERED]);
        $this->assertSame('delivered', $this->lastOrderEvent($customer));

        $order->update(['status' => OrderStatus::CANCELLED]);
        $this->assertSame('cancelled', $this->lastOrderEvent($customer));

        $order->update(['payment_status' => PaymentStatus::REFUNDED]);
        $this->assertSame('refunded', $this->lastOrderEvent($customer));
    }

    public function test_order_status_mail_contains_the_order_summary(): void
    {
        app()->setLocale('vi');

        $customer = $this->makeUser(['first_name' => 'Lan', 'last_name' => 'Nguyen']);
        $order = Order::factory()->create([
            'customer_id' => $customer->id,
            'order_number' => 'SN-123456',
            'total_amount' => 1250000,
            'currency' => 'VND',
            'payment_method' => 1,
            'payment_status' => PaymentStatus::UNPAID,
            'status' => OrderStatus::DELIVERED,
        ]);

        $html = (string) (new OrderStatusMail($order, 'delivered', 'Lan Nguyen'))->render();

        $this->assertStringContainsString('SN-123456', $html);
        $this->assertStringContainsString('1.250.000 VND', $html);
        $this->assertStringContainsString('Đã giao', $html);
        $this->assertStringContainsString('Xem đơn hàng', $html);
    }

    public function test_language_switch_is_persisted_on_the_user_account(): void
    {
        $user = $this->makeUser(['locale' => 'vi']);

        $this->actingAs($user)
            ->post(route('language.switch'), ['locale' => 'en'])
            ->assertRedirect();

        $this->assertSame('en', $user->fresh()->locale);
    }

    private function makeUser(array $attributes = []): User
    {
        return User::factory()->create(array_merge([
            'email' => 'minh.nguyen@example.com',
            'locale' => 'vi',
        ], $attributes));
    }

    private function lastOrderEvent(User $customer): ?string
    {
        $notification = Notification::sent($customer, OrderStatusNotification::class)->last();

        return $notification?->toArray($customer)['event'] ?? null;
    }
}
