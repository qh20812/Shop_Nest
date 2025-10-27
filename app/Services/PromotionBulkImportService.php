<?php

namespace App\Services;

use App\Jobs\BulkImportProcessingJob;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\PromotionImport;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PromotionBulkImportService
{
    public const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 100; // 100MB

    /**
     * Validate CSV file size and extension
     */
    public function validateFile(UploadedFile $file): void
    {
        if ($file->getSize() > self::MAX_FILE_SIZE_BYTES) {
            throw ValidationException::withMessages([
                'file' => 'The uploaded file is too large. Maximum supported size is 100MB.',
            ]);
        }

        if (!in_array($file->getClientOriginalExtension(), ['csv', 'txt'], true)) {
            throw ValidationException::withMessages([
                'file' => 'Only CSV files are supported for bulk import.',
            ]);
        }
    }

    /**
     * Create an import record and dispatch background job
     */
    public function queueImport(Promotion $promotion, UploadedFile $file): PromotionImport
    {
        $this->validateFile($file);

        $path = $file->storeAs(
            'promotion-imports',
            Str::uuid()->toString() . '_' . $file->getClientOriginalName()
        );

        $import = PromotionImport::create([
            'tracking_token' => (string) Str::uuid(),
            'filename' => $file->getClientOriginalName(),
            'promotion_id' => $promotion->promotion_id,
            'created_by' => Auth::id(),
            'status' => 'processing',
            'total_rows' => 0,
            'processed_rows' => 0,
            'failed_rows' => 0,
        ]);

        BulkImportProcessingJob::dispatch($import->import_id, $path);

        return $import;
    }

    /**
     * Process the CSV file and attach products to promotion
     */
    public function processImport(PromotionImport $import, string $path): void
    {
        $promotion = Promotion::find($import->promotion_id);

        if (!$promotion) {
            throw new Exception('Promotion not found for import processing.');
        }

        $fullPath = Storage::path($path);

        if (!is_file($fullPath)) {
            throw new Exception('Import source file is missing.');
        }

        $handle = fopen($fullPath, 'rb');

        if (!$handle) {
            throw new Exception('Unable to open import file for reading.');
        }

        $header = null;
        $rowNumber = 0;
        $processed = 0;
        $failed = 0;
        $errorLog = [];
        $productIds = [];

        try {
            while (($row = fgetcsv($handle)) !== false) {
                $rowNumber++;

                if ($rowNumber === 1) {
                    $header = $this->normaliseHeader($row);
                    continue;
                }

                if (!$header) {
                    $failed++;
                    $errorLog[] = 'Missing CSV header row.';
                    break;
                }

                $data = $this->mapRowToAssoc($header, $row);
                $productId = $this->resolveProductId($data);

                if ($productId === null) {
                    $failed++;
                    $errorLog[] = sprintf('Row %d: Unable to resolve product identifier.', $rowNumber);
                    continue;
                }

                $productIds[] = $productId;
                $processed++;

                if ($processed % 500 === 0) {
                    $this->syncProducts($promotion, $productIds);
                    $productIds = [];
                    $import->update([
                        'processed_rows' => $processed,
                        'failed_rows' => $failed,
                        'total_rows' => $processed + $failed,
                    ]);
                }
            }

            if (!empty($productIds)) {
                $this->syncProducts($promotion, $productIds);
            }

            $import->update([
                'processed_rows' => $processed,
                'failed_rows' => $failed,
                'total_rows' => $processed + $failed,
                'error_log' => empty($errorLog) ? null : implode(PHP_EOL, $errorLog),
                'status' => 'completed',
                'completed_at' => now(),
            ]);
        } catch (Exception $exception) {
            Log::error('Failed to process promotion import', [
                'import_id' => $import->import_id,
                'exception' => $exception->getMessage(),
            ]);

            $import->update([
                'status' => 'failed',
                'error_log' => implode(PHP_EOL, array_merge($errorLog, [$exception->getMessage()])),
                'processed_rows' => $processed,
                'failed_rows' => $failed + 1,
                'total_rows' => $processed + $failed + 1,
            ]);

            throw $exception;
        } finally {
            fclose($handle);
            Storage::delete($path);
        }
    }

    protected function normaliseHeader(array $header): array
    {
        return array_map(static function ($value) {
            return Str::of($value)->lower()->trim()->replace(' ', '_')->toString();
        }, $header);
    }

    protected function mapRowToAssoc(array $header, array $row): array
    {
        $assoc = [];

        foreach ($header as $index => $column) {
            $assoc[$column] = $row[$index] ?? null;
        }

        return $assoc;
    }

    protected function resolveProductId(array $data): ?int
    {
        $productId = Arr::get($data, 'product_id');

        if ($productId && Product::where('product_id', $productId)->exists()) {
            return (int) $productId;
        }

        $sku = Arr::get($data, 'sku');

        if ($sku) {
            $variantProductId = ProductVariant::where('sku', $sku)->value('product_id');
            if ($variantProductId) {
                return (int) $variantProductId;
            }
        }

        return null;
    }

    protected function syncProducts(Promotion $promotion, array $productIds): void
    {
        $uniqueIds = collect($productIds)
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        if ($uniqueIds->isEmpty()) {
            return;
        }

        DB::transaction(function () use ($promotion, $uniqueIds) {
            $promotion->products()->syncWithoutDetaching($uniqueIds->all());
        });
    }

    public function getImportStatus(string $trackingToken): ?array
    {
        $import = PromotionImport::where('tracking_token', $trackingToken)->first();

        if (!$import) {
            return null;
        }

        return [
            'tracking_token' => $import->tracking_token,
            'filename' => $import->filename,
            'total_rows' => $import->total_rows,
            'processed_rows' => $import->processed_rows,
            'failed_rows' => $import->failed_rows,
            'status' => $import->status,
            'completed_at' => optional($import->completed_at)->toDateTimeString(),
            'error_log' => $import->error_log,
        ];
    }
}
