<?php

namespace App\Traits;

use App\Models\PromotionAuditLog;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

trait AuditLoggable
{
    /**
     * Log audit trail for promotion changes
     */
    protected function logAudit(string $action, $model, array $oldValues = [], array $newValues = []): void
    {
        try {
            $auditData = [
                'promotion_id' => $model->promotion_id,
                'user_id' => Auth::id(),
                'action' => $action,
                'old_values' => $oldValues,
                'new_values' => $newValues,
                'ip_address' => Request::ip(),
                'user_agent' => Request::userAgent(),
            ];

            // Validate required fields
            if (empty($auditData['promotion_id'])) {
                Log::warning('Cannot log audit: missing promotion_id', ['model' => get_class($model)]);
                return;
            }

            PromotionAuditLog::create($auditData);

        } catch (Exception $exception) {
            Log::error('Failed to log promotion audit', [
                'promotion_id' => $model->promotion_id ?? 'unknown',
                'action' => $action,
                'exception' => $exception->getMessage()
            ]);
        }
    }

    /**
     * Log bulk audit trail for multiple promotions
     */
    protected function logBulkAudit(string $action, array $promotions, array $oldValues = [], array $newValues = []): void
    {
        foreach ($promotions as $promotion) {
            $this->logAudit($action, $promotion, $oldValues, $newValues);
        }
    }
}