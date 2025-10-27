<?php

namespace App\Jobs;

use App\Models\CustomerSegment;
use App\Services\CustomerSegmentationService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class CustomerSegmentRefreshJob implements ShouldQueue
{
    use Queueable;

    public $tries = 3;
    public $backoff = 60; // 1 minute delay between retries

    /**
     * Create a new job instance.
     */
    public function __construct(
        public ?int $segmentId = null,
        public bool $forceRefresh = false
    ) {}

    /**
     * Execute the job.
     */
    public function handle(CustomerSegmentationService $segmentationService): void
    {
        try {
            $segments = $this->segmentId
                ? CustomerSegment::where('segment_id', $this->segmentId)->get()
                : CustomerSegment::active()->get();

            $processed = 0;
            $errors = 0;

            foreach ($segments as $segment) {
                try {
                    // Skip if segment has no rules and not forced
                    if (empty($segment->rules) && !$this->forceRefresh) {
                        continue;
                    }

                    $segmentationService->refreshSegmentCustomers($segment);
                    $processed++;

                    // Log progress every 10 segments
                    if ($processed % 10 === 0) {
                        Log::info("CustomerSegmentRefreshJob: Processed {$processed} segments");
                    }

                } catch (Exception $exception) {
                    $errors++;
                    Log::error('Failed to refresh segment in job', [
                        'segment_id' => $segment->segment_id,
                        'segment_name' => $segment->name,
                        'exception' => $exception->getMessage()
                    ]);

                    // Continue with other segments
                    continue;
                }
            }

            Log::info('CustomerSegmentRefreshJob completed', [
                'total_segments' => $segments->count(),
                'processed' => $processed,
                'errors' => $errors,
                'segment_id' => $this->segmentId,
                'force_refresh' => $this->forceRefresh
            ]);

        } catch (Exception $exception) {
            Log::error('CustomerSegmentRefreshJob failed', [
                'exception' => $exception->getMessage(),
                'segment_id' => $this->segmentId,
                'force_refresh' => $this->forceRefresh
            ]);

            throw $exception;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(Exception $exception): void
    {
        Log::error('CustomerSegmentRefreshJob permanently failed', [
            'exception' => $exception->getMessage(),
            'segment_id' => $this->segmentId,
            'force_refresh' => $this->forceRefresh
        ]);
    }
}