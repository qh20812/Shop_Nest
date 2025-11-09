<?php

namespace App\Services\Admin;

use App\Models\ShopAuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ShopAuditService
{
    public function logAction(
        User $shop,
        string $action,
        array $oldValues,
        array $newValues,
        ?string $notes,
        ?string $ip
    ): void {
        ShopAuditLog::create([
            'admin_id' => Auth::id(),
            'shop_id' => $shop->id,
            'action' => $action,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $ip,
            'notes' => $notes,
        ]);
    }
}