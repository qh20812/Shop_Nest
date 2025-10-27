<?php

namespace App\Console\Commands;

use App\Models\ProductVariant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CleanupStaleReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservations:cleanup
                            {--force : Force cleanup without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up stale inventory reservations from abandoned checkout sessions';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Checking for stale reservations...');

        $variants = ProductVariant::where('reserved_quantity', '>', 0)->get();

        if ($variants->isEmpty()) {
            $this->info('✅ No stale reservations found.');
            return self::SUCCESS;
        }

        $this->warn("Found {$variants->count()} variant(s) with reservations:");
        
        foreach ($variants->take(10) as $variant) {
            $this->line(sprintf(
                '  - Variant %d: stock=%d, reserved=%d',
                $variant->variant_id,
                $variant->stock_quantity,
                $variant->reserved_quantity
            ));
        }

        if ($variants->count() > 10) {
            $this->line('  ... and ' . ($variants->count() - 10) . ' more');
        }

        if (!$this->option('force') && !$this->confirm('Do you want to reset these reservations?', true)) {
            $this->info('Cleanup cancelled.');
            return self::SUCCESS;
        }

        $this->info('Resetting reservations...');

        $updated = DB::transaction(function () {
            return ProductVariant::where('reserved_quantity', '>', 0)
                ->update(['reserved_quantity' => 0]);
        });

        Log::info('Stale reservations cleaned up', [
            'variants_updated' => $updated,
            'command' => 'reservations:cleanup',
        ]);

        $this->info("✅ Successfully reset {$updated} reservation(s).");

        return self::SUCCESS;
    }
}
