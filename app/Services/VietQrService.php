<?php

namespace App\Services;

use RuntimeException;

class VietQrService
{
    /**
     * Build a VietQR image URL for the configured receiving account.
     */
    public function buildUrl(float $amount, string $code): string
    {
        $bankBin = (string) config('wallet.vietqr.bank_bin');
        $accountNo = (string) config('wallet.vietqr.account_no');
        $accountName = (string) config('wallet.vietqr.account_name');
        $template = (string) config('wallet.vietqr.template', 'compact2');

        if ($bankBin === '' || $accountNo === '' || $accountName === '') {
            throw new RuntimeException('VietQR bank details are not configured.');
        }

        $base = sprintf(
            'https://img.vietqr.io/image/%s-%s-%s.png',
            rawurlencode($bankBin),
            rawurlencode($accountNo),
            rawurlencode($template),
        );

        $query = http_build_query([
            'amount' => (int) round($amount),
            'addInfo' => $code,
            'accountName' => $accountName,
        ], '', '&', PHP_QUERY_RFC3986);

        return $base.'?'.$query;
    }

    /**
     * @return array{bank_bin: string, account_no: string, account_name: string, template: string}
     */
    public function bankInfo(): array
    {
        return [
            'bank_bin' => (string) config('wallet.vietqr.bank_bin'),
            'account_no' => (string) config('wallet.vietqr.account_no'),
            'account_name' => (string) config('wallet.vietqr.account_name'),
            'template' => (string) config('wallet.vietqr.template', 'compact2'),
        ];
    }
}
