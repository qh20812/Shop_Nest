<?php

namespace Tests\Browser;

use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTopup;
use App\Models\WalletTransaction;
use App\Services\WalletTopupService;
use Database\Seeders\RoleSeeder;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class WalletTopupUiTest extends DuskTestCase
{
    private User $customer;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);

        $this->customer = User::factory()->create([
            'email' => 'wallet.qa.'.uniqid().'@example.test',
        ]);
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->firstOrFail());

        Wallet::firstOrCreate(
            ['user_id' => $this->customer->id],
            ['balance' => 0, 'total_earned' => 0, 'total_spent' => 0, 'currency' => 'VND', 'status' => 'active'],
        );

        $this->admin = User::factory()->create([
            'email' => 'wallet.admin.'.uniqid().'@example.test',
        ]);
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->firstOrFail());
    }

    protected function tearDown(): void
    {
        $walletIds = Wallet::where('user_id', $this->customer->id)->pluck('wallet_id');
        WalletTransaction::whereIn('wallet_id', $walletIds)->delete();
        WalletTopup::where('user_id', $this->customer->id)->delete();
        Wallet::where('user_id', $this->customer->id)->delete();

        $this->customer->roles()->detach();
        $this->customer->forceDelete();

        $this->admin->roles()->detach();
        $this->admin->forceDelete();

        parent::tearDown();
    }

    public function test_customer_creates_a_topup_and_admin_credits_the_wallet(): void
    {
        $this->browse(function (Browser $browser): void {
            $browser->loginAs($this->customer->id)
                ->visit('/wallet')
                ->assertSee('Ví ShopNest')
                ->assertSee('Số dư khả dụng')
                ->assertSee('Nạp tiền')
                ->type('#wallet-topup-amount', '100000')
                ->press('Tạo mã nạp')
                ->waitForText('Nội dung chuyển khoản', 10)
                ->assertSee('Tôi đã chuyển')
                ->assertPresent('img[src*="vietqr.io"]')
                ->press('Tôi đã chuyển')
                ->waitForText('Chờ duyệt', 10);
        });

        $topup = WalletTopup::where('user_id', $this->customer->id)->latest('topup_id')->firstOrFail();

        $this->assertSame(WalletTopup::STATUS_TRANSFERRED, $topup->status);

        $this->browse(function (Browser $browser) use ($topup): void {
            $browser->loginAs($this->admin->id)
                ->visit('/admin/wallet-topups?status=transferred&code='.$topup->code)
                ->assertSee('Duyệt nạp ví')
                ->assertSee($topup->code)
                ->press('Phê duyệt')
                ->waitForText('Duyệt khoản nạp '.$topup->code, 10)
                ->press('Xác nhận duyệt')
                ->waitUntilMissingText('Duyệt khoản nạp '.$topup->code, 10);
        });

        $this->assertSame(WalletTopup::STATUS_APPROVED, $topup->fresh()->status);

        $this->browse(function (Browser $browser): void {
            $browser->loginAs($this->customer->id)
                ->visit('/wallet')
                ->assertSee('100.000')
                ->assertSee('Lịch sử giao dịch');
        });
    }

    public function test_customer_wallet_updates_after_approval_without_reloading(): void
    {
        $topup = WalletTopup::create([
            'user_id' => $this->customer->id,
            'wallet_id' => Wallet::where('user_id', $this->customer->id)->value('wallet_id'),
            'code' => 'LIVE01',
            'amount_declared' => 100000,
            'status' => WalletTopup::STATUS_PENDING,
            'expires_at' => now()->addHours(12),
        ]);

        $this->browse(function (Browser $browser) use ($topup): void {
            $browser->loginAs($this->customer->id)
                ->visit('/wallet')
                ->waitForText($topup->code, 10)
                ->assertSee('Tôi đã chuyển');

            app(WalletTopupService::class)->approve($this->admin, $topup->fresh(), 100000);

            $browser->waitForText('+ 100.000', 15)
                ->waitForText('Tạo mã nạp', 15);

            $this->assertStringContainsString('/wallet', (string) $browser->driver->getCurrentURL());
        });
    }

    public function test_admin_queue_shows_a_new_transfer_without_reloading(): void
    {
        $topup = WalletTopup::create([
            'user_id' => $this->customer->id,
            'wallet_id' => Wallet::where('user_id', $this->customer->id)->value('wallet_id'),
            'code' => 'LIVE02',
            'amount_declared' => 150000,
            'status' => WalletTopup::STATUS_PENDING,
            'expires_at' => now()->addHours(12),
        ]);

        $this->browse(function (Browser $browser) use ($topup): void {
            $browser->loginAs($this->admin->id)
                ->visit('/admin/wallet-topups')
                ->assertDontSee($topup->code);

            app(WalletTopupService::class)->markTransferred($this->customer, $topup->fresh());

            $browser->waitForText($topup->code, 12);

            $this->assertStringContainsString('/admin/wallet-topups', (string) $browser->driver->getCurrentURL());
        });
    }
}
