<?php

namespace App\Jobs;

use App\Models\PromotionImport;
use App\Services\PromotionBulkImportService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class BulkImportProcessingJob implements ShouldQueue
{
    use Queueable;

    public $tries = 2;
    public $timeout = 900; // 15 minutes

    public function __construct(
        public int $importId,
        public string $path
    ) {}

    public function handle(PromotionBulkImportService $importService): void
    {
        $import = PromotionImport::find($this->importId);

        if (!$import) {
            Log::warning('BulkImportProcessingJob: import not found', ['import_id' => $this->importId]);
            return;
        }

        try {
            $importService->processImport($import, $this->path);
        } catch (Exception $exception) {
            Log::error('BulkImportProcessingJob failed', [
                'import_id' => $this->importId,
                'exception' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    public function failed(Exception $exception): void
    {
        $import = PromotionImport::find($this->importId);

        if ($import) {
            $import->update([
                'status' => 'failed',
                'error_log' => trim(($import->error_log ? $import->error_log . PHP_EOL : '') . $exception->getMessage()),
            ]);
        }

        Log::error('BulkImportProcessingJob permanently failed', [
            'import_id' => $this->importId,
            'exception' => $exception->getMessage(),
        ]);
    }
}
