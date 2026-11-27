<?php

namespace Tests\Feature\Wallet;

use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTopup;
use App\Models\WalletTransaction;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class WalletPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);

        config([
            'wallet.vietqr.bank_bin' => '970407',
            'wallet.vietqr.bank_name' => 'Techcombank',
            'wallet.vietqr.account_no' => '23712299999999',
            'wallet.vietqr.account_name' => 'HUYNH NGOC QUI',
            'wallet.vietqr.template' => 'compact2',
        ]);
    }

    public function test_guest_is_redirected_from_the_wallet_page(): void
    {
        $this->get(route('wallet.index'))->assertRedirect();
    }

    public function test_customer_wallet_page_exposes_balance_bank_and_limits(): void
    {
        $user = $this->makeUser('Customer');

        Wallet::create([
            'user_id' => $user->id,
            'balance' => 250000,
            'total_earned' => 500000,
            'total_spent' => 250000,
            'currency' => 'VND',
            'status' => 'active',
        ]);

        $this->actingAs($user)
            ->get(route('wallet.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Wallet/Index')
                ->where('layout', 'account')
                ->where('workspace_home', null)
                ->where('wallet.balance', 250000)
                ->where('limits.min', 10000)
                ->where('limits.max', 50000000)
                ->where('presets.0', 100000)
                ->where('presets.3', 1000000)
                ->where('bank.bank_name', 'Techcombank')
                ->where('bank.configured', true)
                ->has('transactions.data', 0)
                ->has('recentTopups', 0)
                ->where('activeTopup', null)
            );
    }

    public function test_seller_uses_the_workspace_layout(): void
    {
        $seller = $this->makeUser('Seller');

        $this->actingAs($seller)
            ->get(route('wallet.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Wallet/Index')
                ->where('layout', 'workspace')
                ->where('workspace_home', '/seller/dashboard')
            );
    }

    public function test_active_topup_is_exposed_and_an_expired_pending_one_is_not(): void
    {
        $user = $this->makeUser('Customer');
        $wallet = $this->makeWallet($user);

        $expired = WalletTopup::create([
            'user_id' => $user->id,
            'wallet_id' => $wallet->wallet_id,
            'code' => 'OLDOLD',
            'amount_declared' => 100000,
            'status' => WalletTopup::STATUS_PENDING,
            'expires_at' => now()->subMinutes(5),
        ]);

        $active = WalletTopup::create([
            'user_id' => $user->id,
            'wallet_id' => $wallet->wallet_id,
            'code' => 'ACTIVE',
            'amount_declared' => 200000,
            'status' => WalletTopup::STATUS_TRANSFERRED,
            'transferred_at' => now(),
            'expires_at' => now()->addHours(12),
        ]);

        $this->actingAs($user)
            ->get(route('wallet.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('activeTopup.code', 'ACTIVE')
                ->has('recentTopups', 1)
                ->where('recentTopups.0.code', 'OLDOLD')
                ->where('recentTopups.0.status', 'expired')
            );

        $this->assertSame(WalletTopup::STATUS_EXPIRED, $expired->fresh()->status);
        $this->assertSame(WalletTopup::STATUS_TRANSFERRED, $active->fresh()->status);
    }

    public function test_wallet_lists_only_the_signed_in_users_transactions(): void
    {
        $user = $this->makeUser('Customer');
        $wallet = $this->makeWallet($user);

        $other = $this->makeUser('Customer');
        $otherWallet = $this->makeWallet($other);

        WalletTransaction::create([
            'wallet_id' => $wallet->wallet_id,
            'type' => WalletTransaction::TYPE_TOP_UP,
            'direction' => 'credit',
            'amount' => 100000,
            'balance_before' => 0,
            'balance_after' => 100000,
            'description' => 'Wallet top-up ACTIVE',
        ]);

        WalletTransaction::create([
            'wallet_id' => $otherWallet->wallet_id,
            'type' => WalletTransaction::TYPE_PURCHASE,
            'direction' => 'debit',
            'amount' => 50000,
            'balance_before' => 50000,
            'balance_after' => 0,
            'description' => 'Someone else order',
        ]);

        $this->actingAs($user)
            ->get(route('wallet.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has('transactions.data', 1)
                ->where('transactions.data.0.description', 'Wallet top-up ACTIVE')
                ->where('transactions.data.0.type', WalletTransaction::TYPE_TOP_UP)
            );
    }

    public function test_admin_queue_page_renders_with_status_counts(): void
    {
        $admin = $this->makeUser('Admin');
        $customer = $this->makeUser('Customer');
        $wallet = $this->makeWallet($customer);

        WalletTopup::create([
            'user_id' => $customer->id,
            'wallet_id' => $wallet->wallet_id,
            'code' => 'QUEUE1',
            'amount_declared' => 100000,
            'status' => WalletTopup::STATUS_TRANSFERRED,
            'transferred_at' => now(),
            'expires_at' => now()->addHours(12),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.wallet-topups.index'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Admin/WalletTopups/Index')
                ->where('filters.status', 'transferred')
                ->where('statusCounts.transferred', 1)
                ->where('statusCounts.approved', 0)
                ->has('topups.data', 1)
                ->where('topups.data.0.code', 'QUEUE1')
                ->where('topups.data.0.user.username', $customer->username)
            );
    }

    public function test_admin_queue_json_endpoint_is_preserved_for_api_clients(): void
    {
        $admin = $this->makeUser('Admin');

        $this->actingAs($admin)
            ->getJson(route('admin.wallet-topups.index'))
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data', 'pagination' => ['current_page', 'last_page', 'per_page', 'total']]);
    }

    public function test_admin_queue_orders_transferred_requests_oldest_first(): void
    {
        $admin = $this->makeUser('Admin');
        $customer = $this->makeUser('Customer');
        $wallet = $this->makeWallet($customer);

        $older = WalletTopup::create([
            'user_id' => $customer->id,
            'wallet_id' => $wallet->wallet_id,
            'code' => 'OLDER1',
            'amount_declared' => 100000,
            'status' => WalletTopup::STATUS_TRANSFERRED,
            'transferred_at' => now()->subHours(3),
            'expires_at' => now()->addHours(12),
        ]);

        $newer = WalletTopup::create([
            'user_id' => $customer->id,
            'wallet_id' => $wallet->wallet_id,
            'code' => 'NEWER1',
            'amount_declared' => 200000,
            'status' => WalletTopup::STATUS_TRANSFERRED,
            'transferred_at' => now()->subHour(),
            'expires_at' => now()->addHours(12),
        ]);

        $this->actingAs($admin)
            ->get(route('admin.wallet-topups.index'))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('topups.data.0.code', $older->code)
                ->where('topups.data.1.code', $newer->code)
            );
    }

    public function test_legacy_seller_wallet_routes_redirect_to_the_shared_wallet(): void
    {
        $seller = $this->makeUser('Seller');

        $this->actingAs($seller)
            ->get('/seller/wallet')
            ->assertRedirect('/wallet');

        $this->actingAs($seller)
            ->get('/seller/wallet/transactions')
            ->assertRedirect('/wallet#lich-su');

        $this->actingAs($seller)
            ->post('/seller/wallet/top-up')
            ->assertNotFound();
    }

    private function makeUser(string $roleName): User
    {
        $user = User::factory()->create();
        $user->roles()->attach(Role::where('name->en', $roleName)->firstOrFail());

        return $user;
    }

    private function makeWallet(User $user): Wallet
    {
        return Wallet::create([
            'user_id' => $user->id,
            'balance' => 0,
            'total_earned' => 0,
            'total_spent' => 0,
            'currency' => 'VND',
            'status' => 'active',
        ]);
    }
}
