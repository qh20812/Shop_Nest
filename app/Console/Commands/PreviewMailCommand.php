<?php

namespace App\Console\Commands;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Mail\GoogleAccountLinkedMail;
use App\Mail\LowStockMail;
use App\Mail\OrderStatusMail;
use App\Mail\ResetPasswordMail;
use App\Mail\ShopStatusMail;
use App\Mail\VerifyEmailMail;
use App\Mail\WelcomeEmail;
use App\Mail\WelcomeGoogleUserMail;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

/**
 * Gửi toàn bộ mẫu email giao dịch về hộp thư thật để review giao diện + nội dung.
 *
 * Mail seller (shop + tồn kho) có thể gửi tới một địa chỉ riêng bằng --seller-to.
 * Dùng sendNow() để gửi ngay, không phụ thuộc queue worker.
 */
class PreviewMailCommand extends Command
{
    protected $signature = 'mail:preview
        {to? : Email nhận mail auth/order (mặc định MAIL_FROM_ADDRESS)}
        {--seller-to= : Email nhận mail seller (mặc định bằng "to")}
        {--group=all : auth|shop|inventory|seller|order|all}
        {--only= : Danh sách slug, cách nhau bởi dấu phẩy}
        {--locale=vi : vi|en}
        {--dump : Ghi thêm HTML vào storage/app/mail-previews}
        {--force : Cho phép chạy trên production}
        {--list : Chỉ liệt kê slug}';

    private const CUSTOMER = 'customer';

    private const SELLER = 'seller';

    /**
     * @var array<string, array{group: string, audience: string}>
     */
    private const MAILS = [
        'welcome' => ['group' => 'auth', 'audience' => self::CUSTOMER],
        'welcome-google' => ['group' => 'auth', 'audience' => self::CUSTOMER],
        'verify' => ['group' => 'auth', 'audience' => self::CUSTOMER],
        'reset-password' => ['group' => 'auth', 'audience' => self::CUSTOMER],
        'google-linked' => ['group' => 'auth', 'audience' => self::CUSTOMER],
        'google-linked-reset' => ['group' => 'auth', 'audience' => self::CUSTOMER],
        'shop-approved' => ['group' => 'shop', 'audience' => self::SELLER],
        'shop-rejected' => ['group' => 'shop', 'audience' => self::SELLER],
        'shop-suspended' => ['group' => 'shop', 'audience' => self::SELLER],
        'shop-reactivated' => ['group' => 'shop', 'audience' => self::SELLER],
        'low-stock' => ['group' => 'inventory', 'audience' => self::SELLER],
        'order-placed' => ['group' => 'order', 'audience' => self::CUSTOMER],
        'order-processing' => ['group' => 'order', 'audience' => self::CUSTOMER],
        'order-delivering' => ['group' => 'order', 'audience' => self::CUSTOMER],
        'order-delivered' => ['group' => 'order', 'audience' => self::CUSTOMER],
        'order-completed' => ['group' => 'order', 'audience' => self::CUSTOMER],
        'order-cancelled' => ['group' => 'order', 'audience' => self::CUSTOMER],
        'order-returned' => ['group' => 'order', 'audience' => self::CUSTOMER],
        'order-refunded' => ['group' => 'order', 'audience' => self::CUSTOMER],
    ];

    public function handle(): int
    {
        if ($this->option('list')) {
            return $this->listMails();
        }

        if (app()->environment('production') && ! $this->option('force')) {
            $this->error('mail:preview không chạy trên production. Thêm --force nếu thật sự cần.');

            return self::FAILURE;
        }

        $to = $this->normalizeEmail($this->argument('to') ?: config('mail.from.address'));

        if (! $to) {
            $this->error('Email nhận không hợp lệ. Ví dụ: php artisan mail:preview you@gmail.com');

            return self::FAILURE;
        }

        $sellerTo = $this->normalizeEmail($this->option('seller-to')) ?: $to;

        if (! $sellerTo) {
            $this->error('Email seller không hợp lệ.');

            return self::FAILURE;
        }

        $locale = (string) $this->option('locale');

        if (! in_array($locale, User::SUPPORTED_LOCALES, true)) {
            $this->error('Locale chỉ nhận: '.implode(', ', User::SUPPORTED_LOCALES));

            return self::FAILURE;
        }

        app()->setLocale($locale);

        $slugs = $this->resolveSlugs();

        if ($slugs === []) {
            return self::FAILURE;
        }

        $customer = $this->makePreviewUser($to, $locale);
        $seller = $this->makePreviewUser($sellerTo, $locale);

        $rows = [];
        $counters = [];
        $failed = 0;

        $totals = [
            self::CUSTOMER => count(array_filter($slugs, fn (string $slug) => self::MAILS[$slug]['audience'] === self::CUSTOMER)),
            self::SELLER => count(array_filter($slugs, fn (string $slug) => self::MAILS[$slug]['audience'] === self::SELLER)),
        ];

        $this->info(sprintf('Gửi %d mail (%s) tới %s · seller: %s', count($slugs), $locale, $to, $sellerTo));

        foreach ($slugs as $slug) {
            $audience = self::MAILS[$slug]['audience'];
            $recipient = $audience === self::SELLER ? $sellerTo : $to;
            $counters[$recipient] = ($counters[$recipient] ?? 0) + 1;

            try {
                $mailable = $this->build($slug, $customer, $seller, $locale, $recipient);

                // Tiền tố để dễ lọc trong hộp thư và biết thứ tự review.
                $subject = sprintf(
                    '[ShopNest PREVIEW · %s %d/%d] %s',
                    $audience,
                    $counters[$recipient],
                    $totals[$audience],
                    $mailable->envelope()->subject,
                );

                if ($this->option('dump')) {
                    $this->dumpHtml($slug, $mailable);
                }

                Mail::to($recipient)->sendNow($mailable->subject($subject));

                $rows[] = [$slug, $audience, $recipient, 'sent', ''];
                $this->line("  ✓ {$slug} → {$recipient}");
            } catch (\Throwable $e) {
                $failed++;
                $rows[] = [$slug, $audience, $recipient, 'failed', Str::limit($e->getMessage(), 90)];
                $this->line("  ✗ {$slug}: ".$e->getMessage());
            }

            // Gmail SMTP giới hạn tần suất; giãn cách nhẹ cho 19 mail.
            usleep(250_000);
        }

        $this->newLine();
        $this->table(['slug', 'nhóm', 'người nhận', 'trạng thái', 'lỗi'], $rows);

        if ($this->option('dump')) {
            $this->info('HTML: '.storage_path('app/mail-previews/index.html'));
        }

        if ($failed > 0) {
            $this->error("{$failed} mail gửi lỗi.");
        } else {
            $this->info('Đã gửi toàn bộ mail preview.');
        }

        return $failed === 0 ? self::SUCCESS : self::FAILURE;
    }

    private function listMails(): int
    {
        $rows = [];

        foreach (self::MAILS as $slug => $meta) {
            $rows[] = [$slug, $meta['group'], $meta['audience']];
        }

        $this->table(['slug', 'nhóm', 'người nhận'], $rows);

        return self::SUCCESS;
    }

    /**
     * @return array<int, string>
     */
    private function resolveSlugs(): array
    {
        $only = (string) $this->option('only');

        if ($only !== '') {
            $requested = array_values(array_filter(array_map('trim', explode(',', $only))));
            $unknown = array_diff($requested, array_keys(self::MAILS));

            if ($unknown !== []) {
                $this->error('Slug không tồn tại: '.implode(', ', $unknown));
                $this->line('Xem danh sách: php artisan mail:preview --list');

                return [];
            }

            return array_values(array_filter(array_keys(self::MAILS), fn (string $slug) => in_array($slug, $requested, true)));
        }

        $group = (string) $this->option('group');
        $groups = match ($group) {
            'all' => ['auth', 'shop', 'inventory', 'order'],
            'seller' => ['shop', 'inventory'],
            'auth', 'shop', 'inventory', 'order' => [$group],
            default => [],
        };

        if ($groups === []) {
            $this->error('--group chỉ nhận: auth, shop, inventory, seller, order, all');

            return [];
        }

        return array_keys(array_filter(
            self::MAILS,
            fn (array $meta) => in_array($meta['group'], $groups, true),
        ));
    }

    private function build(string $slug, User $customer, User $seller, string $locale, string $recipient): Mailable
    {
        if (str_starts_with($slug, 'order-')) {
            $event = Str::after($slug, 'order-');

            return new OrderStatusMail(
                order: $this->sampleOrder($event, $customer),
                event: $event,
                greetingName: $customer->mailName(),
                locale: $locale,
            );
        }

        return match ($slug) {
            'welcome' => new WelcomeEmail($customer, $locale),
            'welcome-google' => new WelcomeGoogleUserMail($customer, $locale),
            'verify' => new VerifyEmailMail($customer, $this->verifyUrl(), $locale),
            'reset-password' => new ResetPasswordMail($customer, $this->resetUrl($recipient), $locale),
            'google-linked' => new GoogleAccountLinkedMail($customer, false, $locale),
            'google-linked-reset' => new GoogleAccountLinkedMail($customer, true, $locale),
            'shop-approved' => $this->shopMail('approved', $seller, $locale),
            'shop-rejected' => $this->shopMail('rejected', $seller, $locale),
            'shop-suspended' => $this->shopMail('suspended', $seller, $locale),
            'shop-reactivated' => $this->shopMail('reactivated', $seller, $locale),
            'low-stock' => $this->lowStockMail($seller, $locale),
            default => throw new \InvalidArgumentException("Không dựng được mail cho slug [{$slug}]."),
        };
    }

    private function shopMail(string $event, User $seller, string $locale): ShopStatusMail
    {
        $shop = $this->shopName($seller);

        $lines = match ($event) {
            'approved' => [
                __('mail.shop.approved.line_1', ['shop' => $shop]),
                __('mail.shop.approved.line_2'),
            ],
            'rejected' => [
                __('mail.shop.rejected.line_1', ['shop' => $shop]),
                __('mail.shop.rejected.reason', ['reason' => 'Hồ sơ shop chưa có giấy phép kinh doanh hợp lệ.']),
                __('mail.shop.rejected.line_2'),
            ],
            'suspended' => [
                __('mail.shop.suspended.line_1', ['shop' => $shop]),
                __('mail.shop.suspended.reason', ['reason' => 'Nhiều đơn hàng giao trễ so với cam kết.']),
                __('mail.shop.suspended.until', ['date' => now()->addDays(14)->format('d/m/Y')]),
                __('mail.shop.suspended.line_2'),
            ],
            'reactivated' => [
                __('mail.shop.reactivated.line_1', ['shop' => $shop]),
                __('mail.shop.reactivated.line_2'),
            ],
        };

        return new ShopStatusMail(
            subjectLine: __('mail.shop.'.$event.'.subject'),
            heading: __('mail.shop.'.$event.'.heading'),
            greetingName: $seller->mailName(),
            lines: $lines,
            actionUrl: route('seller.shop.edit'),
            actionText: __('mail.shop.cta'),
            locale: $locale,
        );
    }

    private function lowStockMail(User $seller, string $locale): LowStockMail
    {
        $product = $seller->exists
            ? Product::where('seller_id', $seller->getKey())->first()
            : null;

        $variant = $product
            ? ProductVariant::where('product_id', $product->product_id)->first()
            : null;

        return new LowStockMail(
            sellerName: $seller->mailName(),
            productName: $product?->getTranslation('name', $locale) ?: 'Áo thun cotton compact',
            variantName: (string) ($variant?->variant_name ?: 'Size M'),
            sku: (string) ($variant?->sku ?: 'SKU-AT-M'),
            quantity: 3,
            threshold: 10,
            // Seller chưa có sản phẩm thì link chỉ mang tính minh hoạ.
            url: route('seller.products.edit', $product?->product_id ?? 990001),
            locale: $locale,
        );
    }

    private function sampleOrder(string $event, User $customer): Order
    {
        [$status, $paymentStatus] = match ($event) {
            'placed' => [OrderStatus::PENDING_CONFIRMATION, PaymentStatus::UNPAID],
            'processing' => [OrderStatus::PROCESSING, PaymentStatus::UNPAID],
            'delivering' => [OrderStatus::DELIVERING, PaymentStatus::UNPAID],
            'delivered' => [OrderStatus::DELIVERED, PaymentStatus::PAID],
            'completed' => [OrderStatus::COMPLETED, PaymentStatus::PAID],
            'cancelled' => [OrderStatus::CANCELLED, PaymentStatus::UNPAID],
            'returned' => [OrderStatus::RETURNED, PaymentStatus::PAID],
            'refunded' => [OrderStatus::RETURNED, PaymentStatus::REFUNDED],
        };

        $order = new Order([
            'customer_id' => $customer->getKey(),
            'order_number' => 'SN-20261124-0001',
            'sub_total' => 1_190_000,
            'shipping_fee' => 60_000,
            'discount_amount' => 0,
            'total_amount' => 1_250_000,
            'currency' => 'VND',
            'payment_method' => 'cod',
            'payment_status' => $paymentStatus,
            'status' => $status,
        ]);

        $order->order_id = 990001;
        $order->created_at = now()->subDays(2);

        return $order;
    }

    private function makePreviewUser(string $email, string $locale): User
    {
        $user = User::whereRaw('LOWER(email) = ?', [strtolower($email)])->first();

        if ($user) {
            // Chỉ đổi locale trong bộ nhớ, không ghi DB.
            $user->locale = $locale;

            return $user;
        }

        return new User([
            'username' => 'minh.nguyen',
            'first_name' => 'Minh',
            'last_name' => 'Nguyễn',
            'email' => $email,
            'locale' => $locale,
        ]);
    }

    private function shopName(User $seller): string
    {
        if (! $seller->exists) {
            return 'Bếp Nhà Minh';
        }

        $name = $seller->ownedShops()->value('name');

        return $name !== null && $name !== '' ? $name : (string) $seller->username;
    }

    /**
     * Link minh hoạ, cố tình dùng id/hash giả để không xác thực tài khoản thật.
     */
    private function verifyUrl(): string
    {
        return URL::temporarySignedRoute('verification.verify', now()->addMinutes(60), [
            'id' => 999001,
            'hash' => sha1('preview-verification@example.com'),
        ]);
    }

    private function resetUrl(string $email): string
    {
        return route('password.reset', [
            'token' => 'preview-token',
            'email' => $email,
        ]);
    }

    private function dumpHtml(string $slug, Mailable $mailable): void
    {
        $directory = storage_path('app/mail-previews');
        File::ensureDirectoryExists($directory);

        file_put_contents($directory.'/'.$slug.'.html', (string) $mailable->render());

        $links = collect(array_keys(self::MAILS))
            ->map(fn (string $item) => '<li><a href="'.$item.'.html">'.$item.'</a></li>')
            ->implode('');

        file_put_contents(
            $directory.'/index.html',
            '<!doctype html><meta charset="utf-8"><title>ShopNest mail previews</title>'
            .'<h1>ShopNest mail previews</h1><ul>'.$links.'</ul>',
        );
    }

    private function normalizeEmail(?string $email): ?string
    {
        $email = strtolower(trim((string) $email));

        return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
    }
}
