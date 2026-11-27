<?php

namespace App\Console\Commands;

use App\Services\WalletTopupService;
use Illuminate\Console\Command;

class ExpireWalletTopups extends Command
{
    protected $signature = 'wallet-topups:expire';

    protected $description = 'Mark pending wallet top-ups as expired after their 24h window';

    public function handle(WalletTopupService $topupService): int
    {
        $count = $topupService->expirePending();

        $this->info("Expired {$count} wallet top-up request(s).");

        return self::SUCCESS;
    }
}
