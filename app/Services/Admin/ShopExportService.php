<?php

namespace App\Services\Admin;

use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ShopExportService
{
    public function export(Builder $query, string $filename): StreamedResponse
    {
        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'Shop ID',
                'Username',
                'Email',
                'Status',
                'Approved At',
                'Suspended Until',
                'Products',
                'Orders',
                'Items Sold',
                'Total Revenue',
                'Open Violations',
            ]);

            $query->chunkById(200, function ($chunk) use ($handle) {
                foreach ($chunk as $shop) {
                    fputcsv($handle, [
                        $shop->id,
                        $shop->username,
                        $shop->email,
                        $shop->shop_status,
                        optional($shop->approved_at)->toDateTimeString(),
                        optional($shop->suspended_until)->toDateTimeString(),
                        $shop->products_count,
                        $shop->orders_count,
                        $shop->items_sold,
                        number_format((float) $shop->total_revenue, 2, '.', ''),
                        $shop->open_violations_count,
                    ]);
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}