<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Copy the legacy seller promotion wallet balances into the unified
     * wallet table. The legacy tables stay in place (read-only) so finance can
     * still reconcile historical rows.
     */
    public function up(): void
    {
        if (! Schema::hasTable('seller_promotion_wallets') || ! Schema::hasTable('wallets')) {
            return;
        }

        $legacyWallets = DB::table('seller_promotion_wallets')->orderBy('wallet_id')->get();

        foreach ($legacyWallets as $legacy) {
            $existingWalletId = DB::table('wallets')->where('user_id', $legacy->seller_id)->value('wallet_id');

            if ($existingWalletId) {
                continue;
            }

            $walletId = DB::table('wallets')->insertGetId([
                'user_id' => $legacy->seller_id,
                'balance' => $legacy->balance ?? 0,
                'total_earned' => $legacy->total_earned ?? 0,
                'total_spent' => $legacy->total_spent ?? 0,
                'currency' => $legacy->currency ?? 'VND',
                'status' => in_array($legacy->status, ['active', 'suspended', 'closed'], true) ? $legacy->status : 'active',
                'created_at' => $legacy->created_at ?? now(),
                'updated_at' => $legacy->updated_at ?? now(),
            ]);

            $balance = (float) ($legacy->balance ?? 0);

            if ($balance > 0) {
                DB::table('wallet_transactions')->insert([
                    'wallet_id' => $walletId,
                    'type' => 'migration',
                    'direction' => 'credit',
                    'amount' => $balance,
                    'balance_before' => 0,
                    'balance_after' => $balance,
                    'reference_type' => 'legacy_wallet_migration',
                    'reference_id' => $legacy->wallet_id,
                    'description' => 'Migrated from seller promotion wallet #'.$legacy->wallet_id,
                    'metadata' => json_encode(['legacy_wallet_id' => $legacy->wallet_id]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('wallet_transactions') || ! Schema::hasTable('wallets')) {
            return;
        }

        $walletIds = DB::table('wallet_transactions')
            ->where('reference_type', 'legacy_wallet_migration')
            ->pluck('wallet_id')
            ->unique()
            ->all();

        DB::table('wallet_transactions')->where('reference_type', 'legacy_wallet_migration')->delete();
        DB::table('wallets')->whereIn('wallet_id', $walletIds)->delete();
    }
};
