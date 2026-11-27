<?php

namespace Tests\Feature\Wallet;

use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\WalletService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class WalletFoundationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private WalletService $walletService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
        $this->user = User::factory()->create();
        $this->user->roles()->attach(Role::where('name->en', 'Seller')->first());
        $this->walletService = app(WalletService::class);
    }

    public function test_legacy_seller_wallet_balance_is_migrated(): void
    {
        DB::table('seller_promotion_wallets')->insert([
            'seller_id' => $this->user->id,
            'balance' => 750000,
            'total_earned' => 1000000,
            'total_spent' => 250000,
            'currency' => 'VND',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $migration = require database_path('migrations/2026_11_26_000001_migrate_seller_promotion_wallets_to_wallets.php');
        $migration->up();

        $wallet = Wallet::where('user_id', $this->user->id)->firstOrFail();

        $this->assertSame(750000.0, (float) $wallet->balance);
        $this->assertSame(1000000.0, (float) $wallet->total_earned);
        $this->assertSame(250000.0, (float) $wallet->total_spent);

        $this->assertDatabaseHas('wallet_transactions', [
            'wallet_id' => $wallet->wallet_id,
            'type' => WalletTransaction::TYPE_MIGRATION,
            'direction' => 'credit',
            'reference_type' => 'legacy_wallet_migration',
        ]);
    }

    public function test_credit_and_debit_update_balance_and_ledger(): void
    {
        $wallet = $this->walletService->forUser($this->user);

        $credit = $this->walletService->credit(
            $wallet->wallet_id,
            500000,
            WalletTransaction::TYPE_TOP_UP,
            'Top-up',
        );

        $wallet->refresh();
        $this->assertSame(500000.0, (float) $wallet->balance);
        $this->assertSame('credit', $credit->direction);
        $this->assertSame(0.0, (float) $credit->balance_before);
        $this->assertSame(500000.0, (float) $credit->balance_after);

        $debit = $this->walletService->debit(
            $wallet->wallet_id,
            200000,
            WalletTransaction::TYPE_PROMOTION_BUDGET,
            'Promotion budget',
        );

        $wallet->refresh();
        $this->assertSame(300000.0, (float) $wallet->balance);
        $this->assertSame(200000.0, (float) $wallet->total_spent);
        $this->assertSame('debit', $debit->direction);
    }

    public function test_debit_rejects_insufficient_balance(): void
    {
        $wallet = $this->walletService->forUser($this->user);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Insufficient wallet balance.');

        $this->walletService->debit(
            $wallet->wallet_id,
            10000,
            WalletTransaction::TYPE_PROMOTION_BUDGET,
            'Too much',
        );
    }

    public function test_refund_does_not_increase_total_earned(): void
    {
        $wallet = $this->walletService->forUser($this->user);

        $this->walletService->credit($wallet->wallet_id, 1000000, WalletTransaction::TYPE_TOP_UP, 'Top-up');
        $this->walletService->debit($wallet->wallet_id, 300000, WalletTransaction::TYPE_PROMOTION_BUDGET, 'Budget');

        $wallet->refresh();
        $earnedBefore = (float) $wallet->total_earned;
        $spentBefore = (float) $wallet->total_spent;

        $this->walletService->credit(
            $wallet->wallet_id,
            200000,
            WalletTransaction::TYPE_PROMOTION_REFUND,
            'Budget release',
            'promotion',
            1,
            true,
            false,
            true,
        );

        $wallet->refresh();

        $this->assertSame($earnedBefore, (float) $wallet->total_earned);
        $this->assertSame(max(0, $spentBefore - 200000), (float) $wallet->total_spent);
        $this->assertSame(900000.0, (float) $wallet->balance);
    }
}
