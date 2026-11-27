<?php

namespace Tests\Feature\Wallet;

use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTopup;
use App\Models\WalletTransaction;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletStateEndpointTest extends TestCase
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

    public function test_guest_cannot_read_wallet_state(): void
    {
        $this->getJson(route('wallet.state'))->assertUnauthorized();
    }

    public function test_state_returns_only_the_signed_in_users_wallet_and_ledger(): void
    {
        $user = $this->makeUser('Customer');
        $wallet = $this->makeWallet($user, 250000);

        $other = $this->makeUser('Customer');
        $otherWallet = $this->makeWallet($other, 900000);

        $this->makeTransaction($wallet->wallet_id, WalletTransaction::TYPE_TOP_UP, 'credit', 250000, 'Own top-up');
        $this->makeTransaction($otherWallet->wallet_id, WalletTransaction::TYPE_PURCHASE, 'debit', 50000, 'Other order');

        $this->actingAs($user)
            ->getJson(route('wallet.state'))
            ->assertOk()
            ->assertJsonPath('wallet.balance', 250000)
            ->assertJsonPath('wallet.status', 'active')
            ->assertJsonPath('filters.type', '')
            ->assertJsonCount(1, 'transactions.data')
            ->assertJsonPath('transactions.data.0.description', 'Own top-up')
            ->assertJsonPath('bank.bank_name', 'Techcombank')
            ->assertJsonMissingPath('transactions.data.1')
            ->assertJsonStructure(['server_time', 'limits', 'presets', 'activeTopup', 'recentTopups']);
    }

    public function test_state_respects_transaction_filters_and_rejects_unknown_types(): void
    {
        $user = $this->makeUser('Customer');
        $wallet = $this->makeWallet($user, 50000);

        $this->makeTransaction($wallet->wallet_id, WalletTransaction::TYPE_TOP_UP, 'credit', 100000, 'Top-up row');
        $this->makeTransaction($wallet->wallet_id, WalletTransaction::TYPE_REFUND, 'credit', 50000, 'Refund row');

        $this->actingAs($user)
            ->getJson(route('wallet.state', ['type' => WalletTransaction::TYPE_REFUND]))
            ->assertOk()
            ->assertJsonCount(1, 'transactions.data')
            ->assertJsonPath('transactions.data.0.description', 'Refund row')
            ->assertJsonPath('filters.type', WalletTransaction::TYPE_REFUND);

        $this->actingAs($user)
            ->getJson(route('wallet.state', ['type' => 'not_a_type']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('type');
    }

    public function test_state_expires_a_stale_pending_topup(): void
    {
        $user = $this->makeUser('Customer');
        $wallet = $this->makeWallet($user);

        $topup = WalletTopup::create([
            'user_id' => $user->id,
            'wallet_id' => $wallet->wallet_id,
            'code' => 'STALE1',
            'amount_declared' => 100000,
            'status' => WalletTopup::STATUS_PENDING,
            'expires_at' => now()->subMinute(),
        ]);

        $this->actingAs($user)
            ->getJson(route('wallet.state'))
            ->assertOk()
            ->assertJsonPath('activeTopup', null);

        $this->assertSame(WalletTopup::STATUS_EXPIRED, $topup->fresh()->status);
    }

    public function test_admin_json_includes_counts_filters_and_server_time(): void
    {
        $admin = $this->makeUser('Admin');
        $customer = $this->makeUser('Customer');
        $wallet = $this->makeWallet($customer);

        WalletTopup::create([
            'user_id' => $customer->id,
            'wallet_id' => $wallet->wallet_id,
            'code' => 'QUEUE2',
            'amount_declared' => 100000,
            'status' => WalletTopup::STATUS_TRANSFERRED,
            'transferred_at' => now(),
            'expires_at' => now()->addHours(12),
        ]);

        $this->actingAs($admin)
            ->getJson(route('admin.wallet-topups.index'))
            ->assertOk()
            ->assertJsonPath('statusCounts.transferred', 1)
            ->assertJsonPath('filters.status', 'transferred')
            ->assertJsonPath('pagination.total', 1)
            ->assertJsonStructure(['server_time', 'data', 'pagination' => ['from', 'to']]);
    }

    public function test_approve_and_reject_return_fresh_status_counts(): void
    {
        $admin = $this->makeUser('Admin');
        $customer = $this->makeUser('Customer');
        $wallet = $this->makeWallet($customer);

        $approve = WalletTopup::create([
            'user_id' => $customer->id,
            'wallet_id' => $wallet->wallet_id,
            'code' => 'APPROV',
            'amount_declared' => 100000,
            'status' => WalletTopup::STATUS_TRANSFERRED,
            'transferred_at' => now(),
            'expires_at' => now()->addHours(12),
        ]);

        $reject = WalletTopup::create([
            'user_id' => $customer->id,
            'wallet_id' => $wallet->wallet_id,
            'code' => 'REJECT',
            'amount_declared' => 200000,
            'status' => WalletTopup::STATUS_PENDING,
            'expires_at' => now()->addHours(12),
        ]);

        $this->actingAs($admin)
            ->postJson(route('admin.wallet-topups.approve', $approve), ['amount_received' => 100000])
            ->assertOk()
            ->assertJsonPath('statusCounts.approved', 1)
            ->assertJsonPath('statusCounts.transferred', 0);

        $this->actingAs($admin)
            ->postJson(route('admin.wallet-topups.reject', $reject), ['reason' => 'No matching transfer'])
            ->assertOk()
            ->assertJsonPath('statusCounts.rejected', 1)
            ->assertJsonPath('statusCounts.pending', 0);
    }

    private function makeUser(string $roleName): User
    {
        $user = User::factory()->create();
        $user->roles()->attach(Role::where('name->en', $roleName)->firstOrFail());

        return $user;
    }

    private function makeWallet(User $user, float $balance = 0): Wallet
    {
        return Wallet::create([
            'user_id' => $user->id,
            'balance' => $balance,
            'total_earned' => $balance,
            'total_spent' => 0,
            'currency' => 'VND',
            'status' => 'active',
        ]);
    }

    private function makeTransaction(int $walletId, string $type, string $direction, float $amount, string $description): WalletTransaction
    {
        return WalletTransaction::create([
            'wallet_id' => $walletId,
            'type' => $type,
            'direction' => $direction,
            'amount' => $amount,
            'balance_before' => 0,
            'balance_after' => $amount,
            'description' => $description,
        ]);
    }
}
