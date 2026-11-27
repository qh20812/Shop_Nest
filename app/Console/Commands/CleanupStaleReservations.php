<?php

namespace App\Console\Commands;

use App\Services\InventoryService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CleanupStaleReservations extends Command
{
    protected $signature = 'reservations:cleanup
                            {--hours=24 : Cancel pending orders with reservations older than this}';

    protected $description = 'Cancel abandoned pending orders and release their stock reservations';

    public function handle(InventoryService $inventoryService): int
    {
        $hours = max(1, (int) $this->option('hours'));

        $cancelled = $inventoryService->releaseStaleReservations($hours);

        Log::info('Stale order reservations cleaned up', [
            'orders_cancelled' => $cancelled,
            'older_than_hours' => $hours,
        ]);

        $this->info("Cancelled {$cancelled} abandoned order(s) and released their reservations.");

        return self::SUCCESS;
    }
}
