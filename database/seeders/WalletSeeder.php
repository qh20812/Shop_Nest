<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\WalletTransaction;
use App\Services\WalletService;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    public function run(): void
    {
        $walletService = app(WalletService::class);

        $sellerRole = Role::where('name->en', 'Seller')->first();
        $customerRole = Role::where('name->en', 'Customer')->first();

        if ($sellerRole) {
            foreach ($sellerRole->users as $seller) {
                $this->seedBalance($walletService, $seller, 5_000_000, 'seller demo balance');
            }
        }

        if ($customerRole) {
            foreach ($customerRole->users as $customer) {
                $this->seedBalance($walletService, $customer, 2_000_000, 'customer demo balance');
            }
        }
    }

    private function seedBalance(WalletService $walletService, User $user, float $amount, string $note): void
    {
        $wallet = $walletService->forUser($user->id);

        if ((float) $wallet->balance > 0 || $wallet->transactions()->exists()) {
            return;
        }

        $walletService->credit(
            $wallet->wallet_id,
            $amount,
            WalletTransaction::TYPE_ADJUSTMENT,
            'Demo wallet seed: '.$note,
            'demo_seed',
            $user->id,
        );
    }
}
