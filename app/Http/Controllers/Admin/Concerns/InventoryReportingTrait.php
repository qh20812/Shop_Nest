<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

trait InventoryReportingTrait
{
    /**
     * Display inventory reports to the admin user.
     */
    public function report(Request $request): Response
    {
        $this->authorize('viewReports', ProductVariant::class);

        return Inertia::render('Admin/Inventory/Report', $this->reportService->buildReportData());
    }

    /**
     * Export current inventory report data to CSV.
     */
    public function export(Request $request): StreamedResponse
    {
        $this->authorize('viewReports', ProductVariant::class);

        $reportData = $this->reportService->buildReportData();
        $fileName = 'inventory-report-' . now()->format('Ymd_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        $callback = function () use ($reportData) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Section', 'Identifier', 'Label', 'Value']);

            foreach ($reportData['statsBySeller'] as $row) {
                fputcsv($handle, ['Seller', $row->seller_id ?? '', $row->seller_name, $row->total_stock]);
            }

            foreach ($reportData['statsByCategory'] as $row) {
                fputcsv($handle, ['Category', $row->category_id ?? '', $row->category_name, $row->total_stock]);
            }

            foreach ($reportData['forecast'] as $row) {
                fputcsv($handle, ['Forecast', $row->variant_id, $row->sku ?? '', $row->avg_daily_demand]);
            }

            fclose($handle);
        };

        return response()->streamDownload($callback, $fileName, $headers);
    }
}
